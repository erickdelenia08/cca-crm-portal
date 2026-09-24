"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getAssignedConsultant } from "./booking.action";

export async function getAdvisoryData() {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "STUDENT") {
            return { success: false, error: "Unauthorized" };
        }

        const studentId = session.user.id;

        // 1. Get Assigned Consultant
        const consultantRes = await getAssignedConsultant();
        const consultant = consultantRes.success ? consultantRes.data : null;

        // 2. Get Bookings / Sessions for the student
        const sessions = await prisma.booking.findMany({
            where: { studentId },
            include: {
                consultant: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { scheduledAt: 'desc' }
        });

        // 3. Get Meeting Notes
        const meetingNotes = await prisma.meetingNote.findMany({
            where: { studentId },
            include: {
                consultant: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            data: {
                consultant,
                sessions,
                meetingNotes
            }
        };

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function cancelAdvisorySession(bookingId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "STUDENT") {
            return { success: false, error: "Unauthorized" };
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking || booking.studentId !== session.user.id) {
            return { success: false, error: "Booking not found or not authorized." };
        }

        if (booking.status !== "PENDING") {
             return { success: false, error: "Hanya sesi PENDING yang dapat dibatalkan." };
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" }
        });

        revalidatePath("/student/advisory");
        return { success: true };
    } catch (error: unknown) {
         const errorMessage = error instanceof Error ? error.message : String(error);
         return { success: false, error: errorMessage };
    }
}
