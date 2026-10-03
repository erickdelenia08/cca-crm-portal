"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { EnrollmentStatus, CourseEnrollmentStatus, Role } from "@prisma/client";
import { auth } from "@/auth";
import {
    CourseEnrollmentInput,
    courseEnrollmentSchema,
    ProgramEnrollmentInput,
    programEnrollmentSchema,
} from "@/schemas/enrollment.schema";

export async function getClientsLookup() {
    const clients = await prisma.user.findMany({
        where: { role: Role.CLIENT, isActive: true },
        include: { clientProfile: true },
        orderBy: { name: "asc" },
    });

    return clients.map((c) => ({
        id: c.id,
        name: c.name || "Unknown",
        email: c.email || "",
        clientNumber: c.clientProfile?.clientNumber || "-",
    }));
}

export async function getConsultantsLookup() {
    const consultants = await prisma.user.findMany({
        where: { role: Role.CONSULTANT, isActive: true },
        orderBy: { name: "asc" },
    });

    return consultants.map((c) => ({
        id: c.id,
        name: c.name || "Unknown",
        email: c.email || "",
    }));
}

export async function getProgramsLookup() {
    const programs = await prisma.program.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });
    return programs;
}

export async function getProgramTypesLookup(programId?: string) {
    const types = await prisma.programType.findMany({
        where: { 
            isActive: true,
            ...(programId ? { programId } : {})
        },
        orderBy: { name: "asc" },
    });
    return types;
}

export async function getCoursesLookup(programTypeId: string) {
    const courses = await prisma.course.findMany({
        where: { programTypeId, isActive: true },
        orderBy: { name: "asc" },
    });
    return courses;
}

export async function getCourseClassesLookup(courseId: string) {
    const classes = await prisma.courseClass.findMany({
        where: { courseId, isActive: true },
        include: {
            teacher: { include: { user: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { code: "asc" },
    });

    return classes.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name || c.code,
        teacherName: c.teacher?.user?.name ?? "N/A",
        schedule: c.schedule || "-",
        maxCapacity: c.maxCapacity,
        currentEnrolled: c._count.enrollments,
        startDate: c.startDate,
        endDate: c.endDate,
    }));
}

export async function getEnrollments() {
    const session = await auth();
    if (!session || (session.user.role !== "MANAGEMENT" && session.user.role !== "PROCESSING_DEPARTMENT")) {
        throw new Error("UNAUTHORIZED");
    }

    const programEnrollments = await prisma.programEnrollment.findMany({
        include: {
            client: true,
            programType: { include: { program: true } },
            consultant: true,
            invoices: true
        },
        orderBy: { createdAt: "desc" },
    });

    return programEnrollments.map((pe) => ({
        id: pe.id,
        clientName: pe.client?.name ?? "Unknown",
        clientEmail: pe.client?.email ?? "N/A",
        programTitle: pe.programType?.program?.name,
        serviceTitle: pe.programType?.name,
        deliveryType: pe.programType?.deliveryType,
        consultantName: pe.programType?.deliveryType === "COURSE" ? "—" : (pe.consultant?.name ?? "—"),
        totalPayment: pe.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0),
        status: pe.status,
        createdAt: pe.createdAt.toISOString(),
    }));
}

export async function getEnrollmentById(id: string) {
    const session = await auth();
    if (!session || (session.user.role !== "MANAGEMENT" && session.user.role !== "PROCESSING_DEPARTMENT")) {
        throw new Error("UNAUTHORIZED");
    }

    const enrollment = await prisma.programEnrollment.findUnique({
        where: { id },
        include: {
            client: true,
            programType: { include: { program: true } },
            consultant: true,
            documentRequirements: {
                include: {
                    documents: true,
                }
            },
            invoices: {
                include: { items: true }
            },
            courseEnrollments: {
                include: {
                    courseClass: {
                        include: {
                            course: true,
                            teacher: { include: { user: true } }
                        }
                    }
                }
            }
        },
    });
    return enrollment;
}

export async function createFullEnrollment(data: {
    programData: ProgramEnrollmentInput,
    courseData?: Omit<CourseEnrollmentInput, 'programEnrollmentId' | 'clientId'>,
    invoiceData?: { totalAmount: number; discount: number; items: { description: string, amount: number, quantity: number, unitPrice: number }[] }
}) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const validatedProgramData = programEnrollmentSchema.parse(data.programData);

    const requirements = await prisma.documentRequirement.findMany({
        where: { programTypeId: validatedProgramData.programTypeId, isActive: true },
    });

    const programType = await prisma.programType.findUnique({
        where: { id: validatedProgramData.programTypeId }
    });

    if (!programType) throw new Error("Program Type not found");
    const deliveryType = programType.deliveryType;

    if (deliveryType === "COURSE") {
        validatedProgramData.consultantId = null;
        if (!data.courseData) throw new Error("Course data is required for COURSE enrollments");
    }

    if (deliveryType === "SERVICE" && data.courseData) {
        throw new Error("Cannot create CourseEnrollment for a SERVICE delivery type");
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Check Capacity if COURSE
            if (deliveryType === "COURSE" && data.courseData) {
                const courseClass = await tx.courseClass.findUnique({
                    where: { id: data.courseData.courseClassId },
                    include: { _count: { select: { enrollments: true } }, course: { include: { programType: true } } }
                });
                if (!courseClass) throw new Error("Course Class not found");
                if (courseClass.course.programTypeId !== validatedProgramData.programTypeId) {
                    throw new Error("Course does not match selected Program Type");
                }
                const availableSeats = courseClass.maxCapacity - courseClass._count.enrollments;
                if (availableSeats <= 0) throw new Error("This class is full. Please select another class.");
            }
            // 1. Create ProgramEnrollment
            const enrollment = await tx.programEnrollment.create({
                data: {
                    clientId: validatedProgramData.clientId,
                    programTypeId: validatedProgramData.programTypeId,
                    consultantId: validatedProgramData.consultantId || null,
                    status: validatedProgramData.status,
                    notes: validatedProgramData.notes,
                    extendedData: validatedProgramData.extendedData ? (validatedProgramData.extendedData as unknown as Prisma.InputJsonValue) : undefined,
                    // Create document requirements snapshots
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

            // 2. If it's a course, create CourseEnrollment
            if (data.courseData) {
                await tx.courseEnrollment.create({
                    data: {
                        clientId: validatedProgramData.clientId,
                        programEnrollmentId: enrollment.id,
                        courseClassId: data.courseData.courseClassId,
                        status: data.courseData.status || "ACTIVE",
                        notes: data.courseData.notes,
                    }
                });
            }

            // 3. Create invoice if provided
            if (data.invoiceData) {
                const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
                
                await tx.invoice.create({
                    data: {
                        invoiceNumber,
                        clientId: validatedProgramData.clientId,
                        programEnrollmentId: enrollment.id,
                        createdById: session.user.id,
                        subtotal: data.invoiceData.totalAmount + data.invoiceData.discount,
                        discountAmount: data.invoiceData.discount,
                        totalAmount: data.invoiceData.totalAmount,
                        status: "DRAFT",
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        items: {
                            create: data.invoiceData.items.map(item => ({
                                description: item.description,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                amount: item.amount
                            }))
                        }
                    }
                });
            }

            // Optional: If consultant is assigned, create assignment record (only for SERVICE)
            if (deliveryType === "SERVICE" && validatedProgramData.consultantId) {
                await tx.clientConsultantAssignment.create({
                    data: {
                        clientId: validatedProgramData.clientId,
                        consultantId: validatedProgramData.consultantId,
                        startDate: new Date(),
                        isTemporary: false,
                        reason: `Assigned during enrollment ${enrollment.id}`
                    }
                });
            }

            return enrollment;
        });

        revalidatePath("/management/enrollments");
        return { success: true, id: result.id };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal membuat enrollment: " + errorMessage);
    }
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus, notes?: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.programEnrollment.update({
            where: { id },
            data: { 
                status,
                ...(notes !== undefined && { notes })
            }
        });
        revalidatePath(`/management/enrollments/${id}`);
        revalidatePath("/management/enrollments");
        return { success: true };
    } catch (error: unknown) {
        throw new Error("Gagal mengupdate status: " + (error instanceof Error ? error.message : String(error)));
    }
}

export async function cancelEnrollment(id: string, reason: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.programEnrollment.update({
            where: { id },
            data: { 
                status: "CANCELLED",
                notes: reason
            }
        });
        revalidatePath(`/management/enrollments/${id}`);
        revalidatePath("/management/enrollments");
        return { success: true };
    } catch (error: unknown) {
        throw new Error("Gagal membatalkan enrollment: " + (error instanceof Error ? error.message : String(error)));
    }
}