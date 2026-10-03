import React from "react";
import Link from "next/link";
import { getClientDocuments, ClientDocumentRequirement } from "@/actions/client-portal.action";
import { DocumentsClient } from "./documents-client";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientDocumentsPage() {
    const res = await getClientDocuments();
    const enrollments = res.data || [];

    if (!res.success) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    Gagal memuat dokumen: {res.error}
                </div>
            </div>
        );
    }

    if (enrollments.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <FileText className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Belum ada persyaratan dokumen.</h2>
                    <p className="text-slate-500 max-w-sm mb-6">Layanan atau programmu saat ini belum memiliki syarat dokumen yang perlu dilengkapi.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Documents</h1>
                <p className="text-slate-500 mt-2">Kelola dan unggah semua dokumen yang dibutuhkan untuk layananmu.</p>
            </div>

            <div className="space-y-10">
                {enrollments.map((enrollment: ClientDocumentRequirement) => {
                    const mappedDocs = enrollment.documentRequirements.map(req => {
                        const doc = req.documents[0];
                        return {
                            requirementId: req.id,
                            code: req.code,
                            title: req.name,
                            description: req.description,
                            isRequired: req.isRequired,
                            documentId: doc?.id || null,
                            status: doc?.status || "NOT_UPLOADED",
                            fileName: doc?.clientDocument?.fileName || doc?.id || null, // clientDocument is not included in query currently, need to update action
                            fileUrl: doc ? `/api/documents/${doc.id}/download` : null,
                            uploadedAt: doc ? new Date(doc.createdAt).toLocaleDateString('id-ID') : null,
                            revisionNote: doc?.revisionNote || null
                        };
                    });

                    return (
                        <div key={enrollment.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                                        {enrollment.programType.program.name}
                                    </p>
                                    <h2 className="text-lg font-bold text-slate-900">{enrollment.programType.name}</h2>
                                </div>
                                <Link 
                                    href={`/client/services/${enrollment.id}`} 
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    Lihat Layanan
                                </Link>
                            </div>
                            
                            <DocumentsClient documents={mappedDocs} enrollmentId={enrollment.id} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}