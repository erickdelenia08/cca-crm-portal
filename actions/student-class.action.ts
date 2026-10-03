"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getStudentClasses() {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "CLIENT") {
            return { success: false, error: "Unauthorized" };
        }

        const clientId = session.user.id;

        // Fetch active enrollments with related class and sessions
        const enrollments = await prisma.courseEnrollment.findMany({
            where: {
                clientId,
                status: "ACTIVE",
            },
            include: {
                courseClass: {
                    include: {
                        course: true,
                        teacher: true,
                        sessions: {
                            orderBy: { startTime: 'asc' },
                            include: {
                                attendances: {
                                    where: { clientId }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Serialize Decimal for client components
        const serializedEnrollments = enrollments.map(enrollment => ({
            ...enrollment,
            courseClass: {
                ...enrollment.courseClass,
                course: {
                    ...enrollment.courseClass.course,
                    basePrice: enrollment.courseClass.course.basePrice 
                        ? Number(enrollment.courseClass.course.basePrice) 
                        : null
                }
            }
        }));

        return { success: true, data: serializedEnrollments };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function submitAbsenceRequest(sessionId: string, reason: string, fileUrl?: string | null) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "CLIENT") {
            return { success: false, error: "Unauthorized" };
        }

        const clientId = session.user.id;

        // Verify that the session belongs to a class the student is enrolled in
        const courseSession = await prisma.courseSession.findUnique({
            where: { id: sessionId },
            include: {
                courseClass: {
                    include: {
                        enrollments: {
                            where: { clientId }
                        }
                    }
                }
            }
        });

        if (!courseSession || courseSession.courseClass.enrollments.length === 0) {
            return { success: false, error: "Sesi tidak ditemukan atau Anda tidak terdaftar di kelas ini." };
        }

        // Upsert the attendance record
        await prisma.courseAttendance.upsert({
            where: {
                sessionId_clientId: {
                    sessionId,
                    clientId
                }
            },
            create: {
                sessionId,
                clientId,
                status: "EXCUSED",
                note: reason,
                attachmentUrl: fileUrl
            },
            update: {
                status: "EXCUSED",
                note: reason,
                attachmentUrl: fileUrl
            }
        });

        revalidatePath("/student/classes");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
