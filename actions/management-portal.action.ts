"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getManagementDashboard() {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        // Get start and end of today in Jakarta time
        const now = new Date();
        const jakartaString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        const jakartaDate = new Date(jakartaString);
        
        const startOfDay = new Date(jakartaDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(jakartaDate);
        endOfDay.setHours(23, 59, 59, 999);

        const [
            totalClients,
            activeEnrollments,
            documentStats,
            todayAttendance,
            totalStaff,
            pendingLeaves,
            todayLeaves
        ] = await Promise.all([
            prisma.user.count({ where: { role: "CLIENT" } }),
            prisma.programEnrollment.count({ where: { status: "ACTIVE" } }),
            prisma.document.groupBy({
                by: ['status'],
                _count: {
                    status: true
                }
            }),
            prisma.attendance.findMany({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            }),
            prisma.staffProfile.count(),
            prisma.leaveRequest.findMany({
                where: { status: "PENDING" },
                include: {
                    staff: { select: { fullName: true, department: true } },
                    requestedBy: { select: { role: true } }
                },
                orderBy: { createdAt: "desc" },
                take: 10
            }),
            prisma.leaveRequest.count({
                where: {
                    status: "APPROVED",
                    startDate: { lte: endOfDay },
                    endDate: { gte: startOfDay }
                }
            })
        ]);

        const documentBottlenecks = documentStats.map((stat: any) => ({
            stage: stat.status,
            count: stat._count.status
        }));

        const presentStaff = todayAttendance.filter((a: any) => a.status === "ON_TIME").length;
        const lateStaff = todayAttendance.filter((a: any) => a.status === "LATE").length;

        return {
            success: true,
            data: {
                metrics: {
                    totalClients,
                    activeEnrollments,
                },
                documentBottlenecks,
                todayAttendance: {
                    totalStaff,
                    present: presentStaff,
                    late: lateStaff,
                    onLeave: todayLeaves
                },
                pendingApprovals: pendingLeaves
            }
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
