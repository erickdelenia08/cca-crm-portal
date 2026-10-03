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

        const documentBottlenecks = documentStats.map((stat) => ({
            stage: stat.status,
            count: stat._count.status
        }));

        const presentStaff = todayAttendance.filter((a) => a.status === "ON_TIME").length;
        const lateStaff = todayAttendance.filter((a) => a.status === "LATE").length;

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

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllBookings() {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        const bookings = await prisma.clientBooking.findMany({
            include: {
                client: { select: { name: true, clientProfile: { select: { fullName: true } } } },
                consultant: { select: { name: true, consultantProfile: { select: { fullName: true } } } },
            },
            orderBy: {
                scheduledAt: "desc"
            }
        });

        return { success: true, data: bookings };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function overrideBookingStatus(id: string, status: BookingStatus) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.clientBooking.update({
            where: { id },
            data: { status }
        });

        revalidatePath("/management/bookings");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

import { DocumentStatus } from "@prisma/client";

export async function getAllDocuments() {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        const documents = await prisma.document.findMany({
            include: {
                client: {
                    select: {
                        name: true,
                        clientProfile: {
                            select: {
                                clientNumber: true
                            }
                        }
                    }
                },
                requirement: {
                    select: {
                        name: true
                    }
                },
                clientDocument: {
                    select: {
                        fileName: true,
                        objectKey: true
                    }
                },
                reviewedBy: {
                    select: {
                        name: true
                    }
                },
                history: {
                    include: {
                        updatedBy: {
                            select: {
                                name: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return { success: true, data: documents };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function overrideDocumentStatus(id: string, status: DocumentStatus, reason: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.$transaction(async (tx) => {
            await tx.document.update({
                where: { id },
                data: { status }
            });

            await tx.documentHistory.create({
                data: {
                    documentId: id,
                    status,
                    note: reason,
                    updatedById: session.user.id
                }
            });
        });

        revalidatePath("/management/documents");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
