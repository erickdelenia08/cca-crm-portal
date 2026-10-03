"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { DocumentStatus, Prisma } from "@prisma/client";

export type ProcessorDashboardSummary = Extract<Awaited<ReturnType<typeof getProcessorDashboard>>, { success: true }>["data"];
export type ProcessorDocumentQueueItem = Extract<Awaited<ReturnType<typeof getDocumentQueue>>, { success: true }>["data"][0];
export type ProcessorEnrollment = Extract<Awaited<ReturnType<typeof getProcessorEnrollments>>, { success: true }>["data"][0];
export type ProcessorEnrollmentDetail = Extract<Awaited<ReturnType<typeof getProcessorEnrollment>>, { success: true }>["data"];
export type ProcessorRequirement = Extract<Awaited<ReturnType<typeof getEnrollmentDocumentRequirements>>, { success: true }>["data"][0];
export type ProcessorDocumentDetail = Extract<Awaited<ReturnType<typeof getDocumentForProcessing>>, { success: true }>["data"];

/**
 * Validates that the current user is an authenticated Processor or Management.
 */
export async function getProcessorProfile() {
    const session = await auth();
    if (!session || !session.user || (session.user.role !== "PROCESSING_DEPARTMENT" && session.user.role !== "MANAGEMENT")) {
        throw new Error("UNAUTHORIZED");
    }

    const staffProfile = await prisma.staffProfile.findUnique({
        where: { userId: session.user.id },
        include: { user: true }
    });

    return staffProfile;
}

/**
 * Get dashboard summary for processor
 */
export async function getProcessorDashboard() {
    try {
        await getProcessorProfile();
        
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // We count documents by status
        // Pending Review: SUBMITTED or UNDER_REVIEW
        const pendingReview = await prisma.document.count({
            where: {
                status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
                enrollment: { programType: { deliveryType: "SERVICE" } }
            }
        });

        const needsReupload = await prisma.document.count({
            where: {
                status: { in: ["REJECTED", "REVISION_REQUIRED"] },
                enrollment: { programType: { deliveryType: "SERVICE" } }
            }
        });

        // Completed Today
        const completedToday = await prisma.document.count({
            where: {
                status: "APPROVED",
                reviewedAt: { gte: todayStart },
                enrollment: { programType: { deliveryType: "SERVICE" } }
            }
        });

        // Missing Documents
        const missingDocuments = await prisma.enrollmentDocumentRequirement.count({
            where: {
                isRequired: true,
                enrollment: { programType: { deliveryType: "SERVICE" } },
                documents: { none: {} }
            }
        });

        return {
            success: true as const,
            data: {
                pendingReview,
                needsReupload,
                completedToday,
                missingDocuments
            }
        };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getDocumentQueue(params?: { search?: string, status?: string }) {
    try {
        await getProcessorProfile();

        // Base where for documents
        const documentWhere: Prisma.DocumentWhereInput = {
            enrollment: { programType: { deliveryType: "SERVICE" } }
        };

        // Base where for missing requirements
        const requirementWhere: Prisma.EnrollmentDocumentRequirementWhereInput = {
            isRequired: true,
            enrollment: { programType: { deliveryType: "SERVICE" } },
            documents: { none: {} }
        };

        // Status Filter
        if (params?.status && params.status !== "ALL") {
            if (params.status === "MISSING") {
                documentWhere.id = "NEVER_MATCH"; // Hack to return no documents
            } else {
                documentWhere.status = params.status as DocumentStatus;
                requirementWhere.id = "NEVER_MATCH"; // Hack to return no missing requirements
            }
        } else {
            documentWhere.status = { in: ["SUBMITTED", "UNDER_REVIEW", "REJECTED", "REVISION_REQUIRED", "APPROVED"] };
        }

        // Search Filter (Client Name, Requirement Name)
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            const searchCondition = {
                OR: [
                    { client: { name: { contains: searchLower } } },
                    { client: { clientProfile: { fullName: { contains: searchLower } } } },
                    { requirement: { name: { contains: searchLower } } }
                ]
            };
            
            const reqSearchCondition = {
                OR: [
                    { name: { contains: searchLower } },
                    { enrollment: { client: { name: { contains: searchLower } } } },
                    { enrollment: { client: { clientProfile: { fullName: { contains: searchLower } } } } }
                ]
            };

            documentWhere.AND = [searchCondition];
            requirementWhere.AND = [reqSearchCondition];
        }

        // 1. Get documents that need attention
        const activeDocuments = await prisma.document.findMany({
            where: documentWhere,
            include: {
                client: { include: { clientProfile: true } },
                requirement: true,
                enrollment: {
                    include: { programType: { include: { program: true } } }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // 2. Get missing requirements
        const missingRequirements = await prisma.enrollmentDocumentRequirement.findMany({
            where: requirementWhere,
            include: {
                enrollment: {
                    include: { 
                        programType: { include: { program: true } },
                        client: { include: { clientProfile: true } }
                    }
                }
            }
        });

        // Map to a consistent queue structure
        const queue = [
            ...activeDocuments.map(doc => ({
                id: doc.id,
                type: 'DOCUMENT' as const,
                enrollmentId: doc.enrollmentId,
                clientId: doc.clientId,
                clientName: doc.client.clientProfile?.fullName || doc.client.name || 'Unknown',
                programName: doc.enrollment.programType.program.name,
                programTypeName: doc.enrollment.programType.name,
                requirementName: doc.requirement.name,
                status: doc.status as DocumentStatus | 'MISSING',
                createdAt: doc.createdAt
            })),
            ...missingRequirements.map(req => ({
                id: req.id,
                type: 'REQUIREMENT' as const,
                enrollmentId: req.enrollmentId,
                clientId: req.enrollment.clientId,
                clientName: req.enrollment.client.clientProfile?.fullName || req.enrollment.client.name || 'Unknown',
                programName: req.enrollment.programType.program.name,
                programTypeName: req.enrollment.programType.name,
                requirementName: req.name,
                status: 'MISSING' as DocumentStatus | 'MISSING',
                createdAt: req.createdAt
            }))
        ];

        // Search Filter by enrollmentId prefix
        let filteredQueue = queue;
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filteredQueue = queue.filter(item => 
                item.clientName.toLowerCase().includes(searchLower) ||
                item.requirementName.toLowerCase().includes(searchLower) ||
                item.enrollmentId.toLowerCase().includes(searchLower) ||
                `enr-${item.enrollmentId.substring(0, 8)}`.toLowerCase().includes(searchLower)
            );
        }

        // Sort by priority/date (Missing/Submitted first)
        filteredQueue.sort((a, b) => {
            const getPriority = (status: string) => {
                if (status === 'MISSING') return 1;
                if (status === 'SUBMITTED' || status === 'UNDER_REVIEW') return 2;
                if (status === 'REVISION_REQUIRED' || status === 'REJECTED') return 3;
                return 4; // APPROVED
            };
            const pA = getPriority(a.status);
            const pB = getPriority(b.status);
            if (pA !== pB) return pA - pB;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        return { success: true as const, data: filteredQueue };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Get service enrollments for processing
 */
export async function getProcessorEnrollments() {
    try {
        await getProcessorProfile();

        const enrollments = await prisma.programEnrollment.findMany({
            where: {
                programType: { deliveryType: "SERVICE" }
            },
            include: {
                client: { include: { clientProfile: true } },
                programType: { include: { program: true } },
                consultant: { include: { consultantProfile: true } },
                _count: {
                    select: { documentRequirements: true, documents: true }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        return { success: true as const, data: enrollments };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Get single enrollment detail for processing
 */
export async function getProcessorEnrollment(enrollmentId: string) {
    try {
        await getProcessorProfile();

        const enrollment = await prisma.programEnrollment.findUnique({
            where: { id: enrollmentId, programType: { deliveryType: "SERVICE" } },
            include: {
                client: { include: { clientProfile: true } },
                programType: { include: { program: true } },
                consultant: { include: { consultantProfile: true } },
                documentRequirements: {
                    include: {
                        documents: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!enrollment) throw new Error("Enrollment not found");

        return { success: true as const, data: enrollment };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Get all document requirements for an enrollment
 */
export async function getEnrollmentDocumentRequirements(enrollmentId: string) {
    try {
        await getProcessorProfile();

        const requirements = await prisma.enrollmentDocumentRequirement.findMany({
            where: { enrollmentId },
            include: {
                documents: {
                    orderBy: { createdAt: 'desc' },
                    include: { clientDocument: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return { success: true as const, data: requirements };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Add a new specific requirement to an enrollment
 */
export async function addEnrollmentDocumentRequirement(enrollmentId: string, data: { name: string, code: string, description?: string, isRequired: boolean }) {
    try {
        await getProcessorProfile();

        // Ensure enrollment exists and is a service
        const enrollment = await prisma.programEnrollment.findUnique({
            where: { id: enrollmentId, programType: { deliveryType: "SERVICE" } }
        });
        if (!enrollment) throw new Error("Enrollment not found or not a service");

        const existing = await prisma.enrollmentDocumentRequirement.findUnique({
            where: { enrollmentId_code: { enrollmentId, code: data.code } }
        });

        if (existing) {
            throw new Error("Requirement with this code already exists for this enrollment");
        }

        const newReq = await prisma.enrollmentDocumentRequirement.create({
            data: {
                enrollmentId,
                name: data.name,
                code: data.code,
                description: data.description,
                isRequired: data.isRequired,
            }
        });

        // Send notification to client
        await prisma.notification.create({
            data: {
                userId: enrollment.clientId,
                title: "New Document Requirement",
                message: `A new document requirement has been added: ${data.name}. Please upload the document as soon as possible.`,
                channel: "IN_APP"
            }
        });

        return { success: true as const, data: newReq };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Get document for processing
 */
export async function getDocumentForProcessing(documentId: string) {
    try {
        await getProcessorProfile();

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                client: { include: { clientProfile: true } },
                requirement: true,
                enrollment: { include: { programType: { include: { program: true } } } },
                clientDocument: true,
                history: {
                    orderBy: { createdAt: 'desc' },
                    include: { updatedBy: { include: { staffProfile: true, consultantProfile: true } } }
                }
            }
        });

        if (!document) throw new Error("Document not found");

        // Mark as UNDER_REVIEW if it was SUBMITTED (optional auto-status, maybe better manual)
        // Let's keep it manual or explicitly requested.

        return { success: true as const, data: document };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Verify document
 */
export async function verifyDocument(documentId: string, note?: string) {
    try {
        const profile = await getProcessorProfile();

        const document = await prisma.document.findUnique({ 
            where: { id: documentId },
            include: { enrollment: { include: { programType: true } } }
        });
        if (!document) throw new Error("Document not found");

        if (document.enrollment.programType.deliveryType !== "SERVICE") {
            throw new Error("Document does not belong to a service enrollment");
        }

        if (document.status === "APPROVED") {
            throw new Error("Document is already verified");
        }

        const validTransitions = ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED", "REJECTED"];
        if (!validTransitions.includes(document.status)) {
            throw new Error("Invalid status transition");
        }

        const updated = await prisma.$transaction(async (tx) => {
            const doc = await tx.document.update({
                where: { id: documentId },
                data: {
                    status: "APPROVED",
                    reviewedById: profile?.userId,
                    reviewedAt: new Date(),
                    revisionNote: note
                }
            });

            await tx.documentHistory.create({
                data: {
                    documentId,
                    status: "APPROVED",
                    note: note || "Document verified",
                    updatedById: profile?.userId || doc.clientId // fallback if admin
                }
            });

            // Send Notification to Client
            await tx.notification.create({
                data: {
                    userId: doc.clientId,
                    title: "Dokumen Disetujui",
                    message: `Dokumen Anda telah berhasil diverifikasi dan disetujui.`,
                    channel: "IN_APP"
                }
            });

            return doc;
        });

        return { success: true as const, data: updated };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Reject document
 */
export async function rejectDocument(documentId: string, reason: string) {
    try {
        if (!reason || reason.trim() === "") {
            throw new Error("A rejection reason is required.");
        }

        const profile = await getProcessorProfile();

        const document = await prisma.document.findUnique({ 
            where: { id: documentId },
            include: { enrollment: { include: { programType: true } }, client: true }
        });
        if (!document) throw new Error("Document not found");

        if (document.enrollment.programType.deliveryType !== "SERVICE") {
            throw new Error("Document does not belong to a service enrollment");
        }

        const validTransitions = ["SUBMITTED", "UNDER_REVIEW"];
        if (!validTransitions.includes(document.status)) {
            throw new Error("Invalid status transition to REVISION_REQUIRED");
        }

        const updated = await prisma.$transaction(async (tx) => {
            const doc = await tx.document.update({
                where: { id: documentId },
                data: {
                    status: "REVISION_REQUIRED", // Client must re-upload
                    reviewedById: profile?.userId,
                    reviewedAt: new Date(),
                    revisionNote: reason
                }
            });

            await tx.documentHistory.create({
                data: {
                    documentId,
                    status: "REVISION_REQUIRED",
                    note: reason,
                    updatedById: profile?.userId || doc.clientId
                }
            });

            // Send notification to client
            await tx.notification.create({
                data: {
                    userId: doc.clientId,
                    title: "Document Revision Required",
                    message: `Your document requires revision. Reason: ${reason}`,
                    channel: "IN_APP"
                }
            });

            return doc;
        });

        return { success: true as const, data: updated };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Request Document via Notification (Follow Up)
 */
export async function requestDocumentReupload(requirementId: string, message: string) {
    try {
        const profile = await getProcessorProfile();

        const req = await prisma.enrollmentDocumentRequirement.findUnique({
            where: { id: requirementId },
            include: { enrollment: true }
        });
        if (!req) throw new Error("Requirement not found");

        // Send a notification to the client
        await prisma.notification.create({
            data: {
                userId: req.enrollment.clientId,
                title: "Document Follow Up",
                message: `Requirement: ${req.name}\n\n${message}`,
                channel: "IN_APP",
                isRead: false
            }
        });

        return { success: true as const };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}

export type ProcessorFollowUp = Extract<Awaited<ReturnType<typeof getProcessingFollowUps>>, { success: true }>["data"][0];

/**
 * Get actionable missing or rejected requirements for follow up
 */
export async function getProcessingFollowUps() {
    try {
        await getProcessorProfile();

        // Find requirements that are required but have no documents
        const missingRequirements = await prisma.enrollmentDocumentRequirement.findMany({
            where: {
                isRequired: true,
                enrollment: { programType: { deliveryType: "SERVICE" } },
                documents: { none: {} }
            },
            include: {
                enrollment: {
                    include: { 
                        programType: true,
                        client: { include: { clientProfile: true } },
                        consultant: { include: { consultantProfile: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Find documents that are rejected/revision_required
        const rejectedDocuments = await prisma.document.findMany({
            where: {
                status: { in: ["REJECTED", "REVISION_REQUIRED"] },
                enrollment: { programType: { deliveryType: "SERVICE" } }
            },
            include: {
                client: { include: { clientProfile: true } },
                requirement: true,
                enrollment: {
                    include: { 
                        programType: true,
                        consultant: { include: { consultantProfile: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to common structure
        const followUps = [
            ...missingRequirements.map(req => ({
                id: req.id,
                requirementId: req.id,
                type: 'MISSING' as const,
                enrollmentId: req.enrollmentId,
                clientName: req.enrollment.client.clientProfile?.fullName || req.enrollment.client.name || 'Unknown',
                clientId: req.enrollment.clientId,
                programName: req.enrollment.programType.name,
                requirementName: req.name,
                consultantName: req.enrollment.consultant?.consultantProfile?.fullName || req.enrollment.consultant?.name,
                date: req.createdAt,
                reason: null
            })),
            ...rejectedDocuments.map(doc => ({
                id: doc.id,
                requirementId: doc.enrollmentDocumentRequirementId,
                type: 'REJECTED' as const,
                enrollmentId: doc.enrollmentId,
                clientName: doc.client.clientProfile?.fullName || doc.client.name || 'Unknown',
                clientId: doc.clientId,
                programName: doc.enrollment.programType.name,
                requirementName: doc.requirement.name,
                consultantName: doc.enrollment.consultant?.consultantProfile?.fullName || doc.enrollment.consultant?.name,
                date: doc.createdAt,
                reason: doc.revisionNote
            }))
        ];

        // Sort by date desc
        followUps.sort((a, b) => b.date.getTime() - a.date.getTime());

        return { success: true as const, data: followUps };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : String(error) };
    }
}
