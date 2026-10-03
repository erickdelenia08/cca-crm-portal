"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type ConsultantDocumentItem = {
    id: string;
    studentId: string;
    studentName: string;
    program: string;
    programTypeName: string;
    documentTitle: string;
    uploadedAt: string;
    status: string;
    revisionNote: string | null;
};

export type GetConsultantDocumentsResponse = 
    | { success: true; data: ConsultantDocumentItem[] }
    | { success: false; error: string };

export async function getConsultantDocuments(): Promise<GetConsultantDocumentsResponse> {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "CONSULTANT") {
            return { success: false, error: "Unauthorized" };
        }

        const consultantId = session.user.id;

        // Fetch documents where the consultant is assigned to the program enrollment
        const documents = await prisma.document.findMany({
            where: {
                enrollment: {
                    consultantId: consultantId
                }
            },
            include: {
                client: {
                    include: { clientProfile: true }
                },
                requirement: {
                    select: { name: true }
                },
                enrollment: {
                    include: {
                        programType: {
                            select: { name: true, program: { select: { name: true } } }
                        }
                    }
                },
                history: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        note: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Map to ConsultantDocumentItem shape
        const mappedDocuments = documents.map(doc => ({
            id: doc.id,
            studentId: doc.clientId,
            studentName: doc.client.clientProfile?.fullName || doc.client.name || "Unknown",
            program: doc.enrollment.programType.program.name,
            programTypeName: doc.enrollment.programType.name,
            documentTitle: doc.requirement.name,
            uploadedAt: doc.createdAt.toISOString(),
            status: doc.status,
            revisionNote: doc.revisionNote || doc.history[0]?.note || null,
        }));

        console.log("mappedDocuments", mappedDocuments);

        return { success: true, data: mappedDocuments };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
