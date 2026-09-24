"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EnrollmentStatus, CourseEnrollmentStatus } from "@prisma/client";
import {
    CourseEnrollmentInput,
    courseEnrollmentSchema,
    ProgramEnrollmentInput,
    programEnrollmentSchema,
} from "@/schemas/enrollment.schema";

/**
 * ========================================================
 * UNIFIED TYPES
 * ========================================================
 */
export interface UnifiedEnrollmentRecord {
    id: string;
    type: "PROGRAM" | "COURSE";

    clientName: string;
    clientEmail: string;

    programTitle?: string;
    consultantName?: string;

    courseTitle?: string;
    className?: string;
    teacherName?: string;

    totalPayment: number;
    status: string;
    createdAt: string;
}

/**
 * ========================================================
 * LOOKUP DATA (FOR FORMS)
 * ========================================================
 */

export async function getStudentsLookup() {
    const students = await prisma.studentProfile.findMany({
        include: { user: true },
        where: { user: { role: "STUDENT" } },
        orderBy: { user: { name: "asc" } },
    });

    return students.map((s) => ({
        id: s.user.id,
        profileId: s.id,
        name: s.user.name,
        email: s.user.email || "",
    }));
}

export async function getConsultantsLookup() {
    const consultants = await prisma.consultantProfile.findMany({
        include: { user: true },
        where: { user: { role: "CONSULTANT" } },
        orderBy: { user: { name: "asc" } },
    });

    return consultants.map((c) => ({
        id: c.user.id,
        profileId: c.id,
        name: c.user.name,
        email: c.user.email,
    }));
}

export async function getProgramsLookup() {
    // Note: Enrollments now point to ProgramType instead of Program.
    // This function now returns ProgramTypes that act as "Programs" for enrollments.
    const programTypes = await prisma.programType.findMany({
        include: { program: true },
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return programTypes.map((pt) => ({
        id: pt.id,
        code: pt.code || "-",
        name: pt.name,
        typeId: pt.programId,
        typeName: pt.program.name,
        destination: "-",
        basePrice: 0,
        description: pt.description || "",
    }));
}

export async function getProgramTypesLookup() {
    const types = await prisma.programType.findMany({
        orderBy: { name: "asc" },
    });

    return types.map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code,
    }));
}

export async function getCoursesLookup() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        include: { programType: true },
        orderBy: { name: "asc" },
    });

    return courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.name,
        category: c.category || "LANGUAGE",
        level: c.level || "BASIC",
        price: Number(c.basePrice) || 0,
    }));
}

export async function getCourseClassesLookup() {
    const classes = await prisma.courseClass.findMany({
        where: { isActive: true },
        include: {
            teacher: { include: { user: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { code: "asc" },
    });

    return classes.map((c) => ({
        id: c.id,
        courseId: c.courseId,
        code: c.code,
        teacherName: c.teacher?.user?.name ?? "N/A",
        schedule: c.schedule || "-",
        maxCapacity: c.maxCapacity,
        currentEnrolled: c._count.enrollments,
        startDate: c.startDate ? c.startDate.toISOString() : "",
        endDate: c.endDate ? c.endDate.toISOString() : "",
    }));
}

/**
 * ========================================================
 * LIST (COMBINED)
 * ========================================================
 */
export async function getEnrollments(): Promise<UnifiedEnrollmentRecord[]> {
    const [programEnrollments, courseEnrollments] = await Promise.all([
        prisma.programEnrollment.findMany({
            include: {
                student: true,
                programType: { include: { program: true } },
                consultant: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.courseEnrollment.findMany({
            // Jika relasi `student` & `courseClass` di CourseEnrollment belum didefinisikan/di-generate,
            // kita hilangkan include yang error.
            orderBy: { createdAt: "desc" },
        }),
    ]);

    const records: UnifiedEnrollmentRecord[] = [];

    // Map Program Enrollments
    programEnrollments.forEach((pe) => {
        records.push({
            id: pe.id,
            type: "PROGRAM",
            clientName: pe.student?.name ?? "Unknown",
            clientEmail: pe.student?.email ?? "N/A",
            programTitle: pe.programType?.program?.name ? `${pe.programType.program.name} - ${pe.programType.name}` : pe.programType?.name ?? "N/A",
            consultantName: pe.consultant?.name ?? "N/A",
            totalPayment: 0,
            status: pe.status,
            createdAt: pe.createdAt.toISOString(),
        });
    });

    // Map Course Enrollments
    courseEnrollments.forEach((ce) => {
        records.push({
            id: ce.id,
            type: "COURSE",
            clientName: "Student", // Sesuaikan jika relasi sudah diperbaiki di Prisma
            clientEmail: "N/A",
            courseTitle: "Course Class",
            className: ce.courseClassId,
            teacherName: "N/A",
            totalPayment: 0,
            status: ce.status,
            createdAt: ce.createdAt.toISOString(),
        });
    });

    records.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return records;
}

/**
 * ========================================================
 * GET BY ID
 * ========================================================
 */
export async function getProgramEnrollmentById(id: string) {
    try {
        const enrollment = await prisma.programEnrollment.findUnique({
            where: { id },
            include: {
                student: true,
                programType: { include: { program: true } },
                consultant: true,
                documentRequirements: true,
                invoices: true,
            },
        });
        return enrollment;
    } catch (error) {
        console.error("Error fetching program enrollment:", error);
        return null;
    }
}

export async function getCourseEnrollmentById(id: string) {
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { id },
        include: {
            invoices: true,
        },
    });
    return enrollment;
}

/**
 * ========================================================
 * CREATE, UPDATE & DELETE
 * ========================================================
 */
export async function createProgramEnrollment(data: ProgramEnrollmentInput) {
    const validatedData = programEnrollmentSchema.parse(data);

    const requirements = await prisma.documentRequirement.findMany({
        where: { programTypeId: validatedData.programTypeId, isActive: true },
    });

    const result = await prisma.$transaction(async (tx) => {
        const enrollment = await tx.programEnrollment.create({
            data: {
                studentId: validatedData.studentId,
                programTypeId: validatedData.programTypeId,
                consultantId: validatedData.consultantId || null,
                status: validatedData.status,
                notes: validatedData.notes,
                documentRequirements: {
                    create: requirements.map((req) => ({
                        requirementId: req.id,
                        code: req.code,
                        name: req.name,
                        description: req.description,
                        isRequired: req.isRequired,
                        isActive: true,
                    })),
                },
            },
        });

        if (validatedData.consultantId) {
            await tx.studentConsultantAssignment.create({
                data: {
                    studentId: validatedData.studentId,
                    consultantId: validatedData.consultantId,
                    startDate: new Date(),
                    isTemporary: false,
                    reason: `Initial assignment via Program Enrollment (${enrollment.id})`,
                },
            });
        }

        return enrollment;
    });

    revalidatePath("/management/enrollments");
    return result;
}

export async function createCourseEnrollment(data: CourseEnrollmentInput) {
    const validatedData = courseEnrollmentSchema.parse(data);

    const enrollment = await prisma.courseEnrollment.create({
        data: {
            studentId: validatedData.studentId,
            courseClassId: validatedData.courseClassId,
            status: validatedData.status,
            notes: validatedData.notes,
        },
    });

    revalidatePath("/management/enrollments");
    return enrollment;
}

export async function updateEnrollmentStatus(
    id: string,
    type: "PROGRAM" | "COURSE",
    status: EnrollmentStatus | CourseEnrollmentStatus
) {
    if (type === "PROGRAM") {
        await prisma.programEnrollment.update({
            where: { id },
            data: { status: status as EnrollmentStatus },
        });
    } else {
        await prisma.courseEnrollment.update({
            where: { id },
            data: { status: status as CourseEnrollmentStatus },
        });
    }
    revalidatePath(`/management/enrollments/${id}`);
    revalidatePath("/management/enrollments");
}

export async function deleteEnrollment(id: string, type: "PROGRAM" | "COURSE") {
    if (type === "PROGRAM") {
        await prisma.programEnrollment.delete({ where: { id } });
    } else {
        await prisma.courseEnrollment.delete({ where: { id } });
    }
    revalidatePath("/management/enrollments");
}