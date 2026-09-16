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
        orderBy: { createdAt: "desc" },
    });

    // Serialize Decimal for client components
    return courses.map((course) => ({
        ...course,
        basePrice: course.basePrice ? Number(course.basePrice) : 0,
    }));
}

export async function upsertCourse(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, ...courseData } = result.data;

    try {
        if (id) {
            await prisma.course.update({
                where: { id },
                data: courseData,
            });
        } else {
            await prisma.course.create({
                data: courseData,
            });
        }
        revalidatePath("/management/courses");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan kursus: " + errorMessage);
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
