"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { courseClassSchema } from "@/schemas/course-class.schema";

export async function createCourseClass(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseClassSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { patterns, ...classData } = result.data;
    classData.code = classData.code.trim().toUpperCase();

    const existing = await prisma.courseClass.findUnique({
        where: {
            courseId_code: {
                courseId: classData.courseId,
                code: classData.code
            }
        }
    });

    if (existing) {
        throw new Error("Class code already exists for this course");
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create the Operational Batch (CourseClass)
            const courseClass = await tx.courseClass.create({
                data: {
                    courseId: classData.courseId,
                    teacherId: classData.teacherId,
                    code: classData.code,
                    name: classData.name,
                    maxCapacity: classData.maxCapacity,
                    startDate: new Date(classData.startDate),
                    endDate: new Date(classData.endDate),
                    isActive: classData.isActive !== undefined ? classData.isActive : true,
                    // 2. Create the Schedule Patterns simultaneously
                    schedulePatterns: {
                        create: patterns.map(p => ({
                            dayOfWeek: p.dayOfWeek,
                            startTime: p.startTime,
                            endTime: p.endTime,
                            defaultMode: p.defaultMode || "OFFLINE",
                            defaultLocation: p.defaultLocation,
                        }))
                    }
                },
                include: { schedulePatterns: true }
            });

            // 3. Auto-generate CourseSessions based on patterns and date range
            const sessionsToCreate = [];
            const current = new Date(classData.startDate);
            const end = new Date(classData.endDate);

            let sessionCounter = 1;

            while (current <= end) {
                const day = current.getDay();

                // Check if current day matches any pattern
                const matchingPattern = courseClass.schedulePatterns.find(p => p.dayOfWeek === day);

                if (matchingPattern) {
                    const [startHr, startMin] = matchingPattern.startTime.split(":");
                    const [endHr, endMin] = matchingPattern.endTime.split(":");

                    const sessionStart = new Date(current);
                    sessionStart.setHours(parseInt(startHr), parseInt(startMin), 0);

                    const sessionEnd = new Date(current);
                    sessionEnd.setHours(parseInt(endHr), parseInt(endMin), 0);

                    sessionsToCreate.push({
                        courseClassId: courseClass.id,
                        patternId: matchingPattern.id,
                        origin: "RECURRING" as const, // Cast to the Enum implicitly based on Prisma schema
                        title: `Session ${sessionCounter}`,
                        startTime: sessionStart,
                        endTime: sessionEnd,
                        mode: matchingPattern.defaultMode,
                        location: matchingPattern.defaultLocation,
                    });

                    sessionCounter++;
                }
                // Move to next day
                current.setDate(current.getDate() + 1);
            }

            // Insert all generated sessions
            if (sessionsToCreate.length > 0) {
                await tx.courseSession.createMany({
                    data: sessionsToCreate
                });
            }
        });

        revalidatePath(`/management/courses/${classData.courseId}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Gagal membuat Course Class dan Session: " + errorMessage);

        throw new Error("Gagal membuat Course Class dan Session: " + errorMessage);
    }
}

export async function deleteCourseClass(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        await prisma.courseClass.delete({
            where: { id }
        });
        revalidatePath(`/management/courses`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menghapus Course Class: " + errorMessage);
    }
}

export async function updateCourseClass(id: string, data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = courseClassSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { patterns, ...classData } = result.data;
    classData.code = classData.code.trim().toUpperCase();

    const existing = await prisma.courseClass.findUnique({
        where: {
            courseId_code: {
                courseId: classData.courseId,
                code: classData.code
            }
        }
    });

    if (existing && existing.id !== id) {
        throw new Error("Class code already exists for this course");
    }

    try {
        await prisma.courseClass.update({
            where: { id },
            data: {
                teacherId: classData.teacherId,
                code: classData.code,
                name: classData.name,
                maxCapacity: classData.maxCapacity,
                startDate: new Date(classData.startDate),
                endDate: new Date(classData.endDate),
                isActive: classData.isActive,
            }
        });

        revalidatePath(`/management/courses/${classData.courseId}`);
        revalidatePath(`/management/courses/${classData.courseId}/classes/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengupdate Course Class: " + errorMessage);
    }
}

export async function toggleCourseClassStatus(id: string, isActive: boolean) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        const cls = await prisma.courseClass.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath(`/management/courses/${cls.courseId}`);
        revalidatePath(`/management/courses/${cls.courseId}/classes/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengubah status Course Class: " + errorMessage);
    }
}
