import { getAllDocuments } from "@/actions/management-portal.action";
import { DocumentsClient, AdminDocumentItem } from "./documents-client";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DocumentStatus } from "@prisma/client";

type DocumentsResponse = Awaited<ReturnType<typeof getAllDocuments>>;

export default async function AdminDocumentsPage() {
    const response = await getAllDocuments();

    let documents: AdminDocumentItem[] = [];

    if (response.success && response.data) {
        documents = response.data.map((doc) => {
            const studentProfile = doc.client.clientProfile;
            return {
                id: doc.id,
                studentName: doc.client.name || "Unknown Student",
                studentId: studentProfile?.clientNumber || "Unknown ID",
                docType: doc.requirement?.name || "Unknown Requirement",
                fileName: doc.clientDocument?.fileName || "No File",
                uploadDate: format(new Date(doc.createdAt), "dd MMM yyyy", { locale: localeId }),
                status: doc.status as DocumentStatus,
                fileUrl: doc.clientDocument?.objectKey ? `/api/files/download?key=${encodeURIComponent(doc.clientDocument.objectKey)}` : "#",
                assignedProcessor: doc.reviewedBy?.name || "Unassigned",
                overrideHistory: doc.history.map((h) => ({
                    action: `Status diubah ke ${h.status}`,
                    performedBy: `${h.updatedBy.name} (${h.updatedBy.role})`,
                    timestamp: format(new Date(h.createdAt), "dd MMM yyyy HH:mm", { locale: localeId }) + " WIB",
                    reason: h.note || "-",
                }))
            };
        });
    }

    return (
        <DocumentsClient initialDocuments={documents} />
    );
}