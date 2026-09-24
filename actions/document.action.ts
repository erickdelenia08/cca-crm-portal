"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getProcessorDocuments() {
    try {
        const session = await auth();

        if (!session?.user?.id || (session.user.role !== "PROCESSING_DEPARTMENT" && session.user.role !== "MANAGEMENT")) {
            return { success: false, error: "Unauthorized" };
        }

        const documents = await prisma.document.findMany({
            include: {
                student: {
                    select: { name: true }
                },
                requirement: {
                    select: { name: true }
                },
                history: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        updatedBy: { select: { name: true, role: true } }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: documents };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function updateDocumentStatus(
    documentId: string,
    status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "REVISION_REQUIRED",
    revisionNote?: string,
    outcomeFileName?: string
) {
    try {
        const session = await auth();

        if (!session?.user?.id || (session.user.role !== "PROCESSING_DEPARTMENT" && session.user.role !== "MANAGEMENT")) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        const updateData: Record<string, string | Date | null> = {
            status,
            revisionNote: revisionNote || null,
        };

        if (outcomeFileName) {
            updateData.outcomeObjectKey = outcomeFileName;
        }

        if (status === "APPROVED" || status === "REJECTED") {
            updateData.reviewedById = userId;
            updateData.reviewedAt = new Date();
        }

        // Transaction to update document and insert history
        await prisma.$transaction(async (tx) => {
            await tx.document.update({
                where: { id: documentId },
                data: updateData
            });

            await tx.documentHistory.create({
                data: {
                    documentId,
                    status,
                    note: revisionNote || undefined,
                    updatedById: userId
                }
            });
        });

        revalidatePath("/processor/documents");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getProcessorDashboardData() {
    try {
        const session = await auth();

        if (!session?.user?.id || (session.user.role !== "PROCESSING_DEPARTMENT" && session.user.role !== "MANAGEMENT")) {
            return { success: false, error: "Unauthorized" };
        }

        // 1. Group counts by status
        const counts = await prisma.document.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });

        // 2. Priority queue: Unfinished documents updated more than 3 days ago
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const priorityDocuments = await prisma.document.findMany({
            where: {
                status: {
                    in: ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED"]
                },
                updatedAt: {
                    lt: threeDaysAgo
                }
            },
            include: {
                student: { select: { name: true } },
                requirement: { select: { name: true } },
                reviewedBy: { select: { name: true } }
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });

        return { success: true, data: { counts, priorityDocuments } };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
