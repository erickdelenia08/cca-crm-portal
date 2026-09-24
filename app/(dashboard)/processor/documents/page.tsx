import { ComponentProps } from "react";
import { getProcessorDocuments } from "@/actions/document.action";
import { DocumentQueueClient } from "@/components/shared/document-queue-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProcessorDocumentsPage() {
    const res = await getProcessorDocuments();
    console.log('ini getProcessorDocumentsssssssssssssssssssssssss');
    console.log(res);

    if (!res.success) {
        if (res.error === "Unauthorized") {
            redirect("/login");
        }
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    <h2 className="font-bold mb-1">Gagal Memuat Data Dokumen</h2>
                    <p className="text-sm">{res.error}</p>
                </div>
            </div>
        );
    }

    const documents = res.data as unknown as ComponentProps<typeof DocumentQueueClient>["initialDocuments"];
    console.log('ini documentttt');
    console.log(documents);

    if (!documents) {
        return null;
    }

    return (
        <DocumentQueueClient initialDocuments={documents} />
    );
}