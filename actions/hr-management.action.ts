"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllLeaveRequests() {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        const requests = await prisma.leaveRequest.findMany({
            include: {
                staff: {
                    select: { fullName: true, department: true }
                },
                requestedBy: {
                    select: { email: true, role: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, data: requests };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function updateLeaveRequestStatus(requestId: string, status: "APPROVED" | "REJECTED", reviewNote: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        const updated = await prisma.leaveRequest.update({
            where: { id: requestId },
            data: {
                status,
                approvedById: session.user.id,
                approvedAt: new Date(),
                reviewNote
            }
        });

        revalidatePath("/management/leave");
        // Also revalidate staff's leave page
        revalidatePath("/consultant/leave");
        revalidatePath("/teacher/leave");

        return { success: true, data: updated };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
