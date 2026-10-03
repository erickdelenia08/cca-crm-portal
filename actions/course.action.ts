"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { courseSchema } from "@/schemas/course.schema";
import { revalidatePath } from "next/cache";

export async function getCourses() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const courses = await prisma.course.findMany({
        include: {
            programType: {
                include: { program: true }
            },
            _count: {
                select: { classes: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    // Serialize Decimal for client components
    return courses.map((course) => ({
        ...course,
        basePrice: course.basePrice ? Number(course.basePrice) : 0,
    }));
}

export async function getCourseById(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            programType: {
                include: {
                    program: true
                }
            },
            classes: {
                include: {
                    teacher: {
                        include: {
                            user: true
                        }
                    },
                    _count: {
                        select: { enrollments: true, sessions: true }
                    }
                },
                orderBy: { startDate: 'desc' }
            }
        }
    });

    if (!course) return null;

    return {
        ...course,
        basePrice: course.basePrice ? Number(course.basePrice) : 0,
    };
}

export async function createCourse(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, ...courseData } = result.data;
    
    // Check ProgramType
    const pt = await prisma.programType.findUnique({ where: { id: courseData.programTypeId } });
    if (!pt || pt.deliveryType !== "COURSE") {
        throw new Error("Invalid Program Type (must be COURSE)");
    }
    
    courseData.code = courseData.code.trim().toUpperCase();
    courseData.name = courseData.name.trim();

    const existing = await prisma.course.findUnique({
        where: { code: courseData.code }
    });

    if (existing) {
        throw new Error("Course code already exists");
    }

    try {
        await prisma.course.create({
            data: courseData,
        });
        revalidatePath("/management/courses");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal membuat kursus: " + errorMessage);
    }
}

export async function updateCourse(id: string, data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id: _, ...courseData } = result.data;

    // Check ProgramType
    const pt = await prisma.programType.findUnique({ where: { id: courseData.programTypeId } });
    if (!pt || pt.deliveryType !== "COURSE") {
        throw new Error("Invalid Program Type (must be COURSE)");
    }
    
    courseData.code = courseData.code.trim().toUpperCase();
    courseData.name = courseData.name.trim();

    const existing = await prisma.course.findUnique({
        where: { code: courseData.code }
    });

    if (existing && existing.id !== id) {
        throw new Error("Course code already exists");
    }

    try {
        await prisma.course.update({
            where: { id },
            data: courseData,
        });
        revalidatePath("/management/courses");
        revalidatePath(`/management/courses/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengupdate kursus: " + errorMessage);
    }
}

export async function toggleCourseStatus(id: string, isActive: boolean) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.course.update({
            where: { id },
            data: { isActive },
        });
        revalidatePath("/management/courses");
        revalidatePath(`/management/courses/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengubah status kursus: " + errorMessage);
    }
}

export async function deleteCourse(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.course.delete({
            where: { id },
        });
        revalidatePath("/management/courses");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menghapus kursus: " + errorMessage);
    }
}
