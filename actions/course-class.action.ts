"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { courseClassSchema } from "@/schemas/course-class.schema";
import { revalidatePath } from "next/cache";
import { Department } from "@prisma/client";

export async function getCourseClasses(courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const classes = await prisma.courseClass.findMany({
        where: { courseId },
        include: {
            teacher: {
                include: {
                    user: true
                }
            },
            _count: {
                select: { enrollments: true }
            }
        },
        orderBy: { startDate: "asc" }
    });

    return classes.map(c => ({
        id: c.id,
        code: c.code,
        courseId: c.courseId,
        teacherId: c.teacherId,
        teacherName: c.teacher.user.name || c.teacher.fullName || "-",
        schedule: c.schedule || "-",
        maxCapacity: c.maxCapacity,
        currentEnrolled: c._count.enrollments,
        startDate: c.startDate.toISOString().split("T")[0],
        endDate: c.endDate.toISOString().split("T")[0],
    }));
}

export async function getTeachers() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    return await prisma.staffProfile.findMany({
        where: {
            department: Department.ACADEMIC
        },
        include: {
            user: true
        }
    });
}

export async function getCourseById(courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });
    
    if (!course) return null;
    
    return {
        ...course,
        basePrice: course.basePrice ? Number(course.basePrice) : 0,
    };
}

export async function upsertCourseClass(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseClassSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, courseId, ...classData } = result.data;
    
    const startDate = new Date(classData.startDate);
    const endDate = new Date(classData.endDate);

    try {
        if (id) {
            await prisma.courseClass.update({
                where: { id },
                data: {
                    ...classData,
                    startDate,
                    endDate,
                },
            });
        } else {
            await prisma.courseClass.create({
                data: {
                    courseId,
                    ...classData,
                    startDate,
                    endDate,
                },
            });
        }
        revalidatePath(`/management/courses/${courseId}/classes`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan kelas: " + errorMessage);
    }
}

export async function deleteCourseClass(id: string, courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.courseClass.delete({
            where: { id },
        });
        revalidatePath(`/management/courses/${courseId}/classes`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menghapus kelas: " + errorMessage);
    }
}
