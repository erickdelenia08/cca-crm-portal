"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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
        email: s.user.email,
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
    const programs = await prisma.program.findMany({
        include: { type: true },
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return programs.map((p) => ({
        id: p.id,
        code: p.code || "-",
        name: p.name,
        typeId: p.typeId,
        typeName: p.type.name,
        destination: p.destination || "-",
        basePrice: Number(p.basePrice) || 0,
        description: p.description || "",
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
        orderBy: { name: "asc" },
    });

    return courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.name,
        category: c.category,
        level: c.level,
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
        teacherName: c.teacher.user.name,
        schedule: c.schedule || "-",
        maxCapacity: c.maxCapacity,
        currentEnrolled: c._count.enrollments,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate.toISOString(),
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
                student: { include: { user: true } },
                program: true,
                consultant: { include: { user: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.courseEnrollment.findMany({
            include: {
                student: { include: { user: true } },
                courseClass: {
                    include: {
                        course: true,
                        teacher: { include: { user: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    const records: UnifiedEnrollmentRecord[] = [];

    // Map Program Enrollments
    programEnrollments.forEach((pe) => {
        records.push({
            id: pe.id,
            type: "PROGRAM",
            clientName: pe.student.user.name ?? "Unknown",
            clientEmail: pe.student.user.email ?? "N/A",
            programTitle: pe.program.name,
            consultantName: pe.consultant?.user.name ?? "N/A",
            totalPayment: 0, // Invoices handled separately
            status: pe.status,
            createdAt: pe.createdAt.toISOString(),
        });
    });

    // Map Course Enrollments
    courseEnrollments.forEach((ce) => {
        records.push({
            id: ce.id,
            type: "COURSE",
            clientName: ce.student.user.name ?? "Unknown",
            clientEmail: ce.student.user.email ?? "N/A",
            courseTitle: ce.courseClass.course.name,
            className: ce.courseClass.code,
            teacherName: ce.courseClass.teacher.user.name ?? "N/A",
            totalPayment: 0, // Invoices handled separately
            status: ce.status,
            createdAt: ce.createdAt.toISOString(),
        });
    });

    // Sort combined by createdAt DESC
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
        console.log("IDdddddddddddd: ", id);
        const enrollment = await prisma.programEnrollment.findUnique({
            where: { id },
            include: {
                student: { include: { user: true } },
                program: { include: { type: true } },
                consultant: { include: { user: true } },
                documentRequirements: true,
                invoices: true,
            },
        });
        return enrollment;
    } catch (error) {
        console.log("ID: ", id);
        console.error("Error fetching program enrollment:", error);
        return null;
    }


}

export async function getCourseEnrollmentById(id: string) {
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { id },
        include: {
            student: { include: { user: true } },
            courseClass: {
                include: {
                    course: true,
                    teacher: { include: { user: true } },
                },
            },
            invoices: true,
        },
    });
    return enrollment;
}

/**
 * ========================================================
 * CREATE
 * ========================================================
 */
export async function createProgramEnrollment(data: ProgramEnrollmentInput) {
    const validatedData = programEnrollmentSchema.parse(data);

    console.log("DEBUG studentId:", validatedData.studentId);
    console.log("DEBUG programId:", validatedData.programId);
    // Get current DocumentRequirements for this program
    const requirements = await prisma.documentRequirement.findMany({
        where: { programId: validatedData.programId, isActive: true },
    });

    const result = await prisma.$transaction(async (tx) => {
        const enrollment = await tx.programEnrollment.create({
            data: {
                studentId: validatedData.studentId,
                programId: validatedData.programId,
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

/**
 * ========================================================
 * UPDATE & DELETE
 * ========================================================
 */
import { EnrollmentStatus, CourseEnrollmentStatus } from "@prisma/client";

export async function updateEnrollmentStatus(id: string, type: "PROGRAM" | "COURSE", status: "ACTIVE" | "CANCELLED" | "COMPLETED" | "ONBOARDING" | "PROCESSING") {
    if (type === "PROGRAM") {
        await prisma.programEnrollment.update({
            where: { id },
            data: { status: status as EnrollmentStatus }
        });
    } else {
        await prisma.courseEnrollment.update({
            where: { id },
            data: { status: status as CourseEnrollmentStatus }
        });
    }
    revalidatePath(`/management/enrollments/${id}`);
    revalidatePath("/management/enrollments");
}

export async function deleteEnrollment(id: string, type: "PROGRAM" | "COURSE") {
    if (type === "PROGRAM") {
        await prisma.programEnrollment.delete({
            where: { id }
        });
    } else {
        await prisma.courseEnrollment.delete({
            where: { id }
        });
    }
    revalidatePath("/management/enrollments");
}
