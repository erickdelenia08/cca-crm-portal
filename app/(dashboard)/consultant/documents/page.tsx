import { getConsultantDocuments } from "@/actions/consultant-portal.action";
import {
    FileSearch,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    FileText,
} from "lucide-react";

export default async function ConsultantDocumentsPage() {
    const documentsRes = await getConsultantDocuments();

    if (!documentsRes.success) {
        return (
            <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-rose-800">
                    Gagal memuat dokumen: {documentsRes.error}
                </div>
            </div>
        );
    }

    const documents = documentsRes.data;


    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Portal Verifikasi */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Dokumen Siswa
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Pantau dokumen yang terkait dengan siswa yang ditugaskan kepada Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Total Berkas:</span>
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-full">
                            {documents.length} Dokumen
                        </span>
                    </div>
                </div>
            </div>

            {/* List Dokumen */}
            <div className="space-y-3">
                {documents.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
                        <FileSearch className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-900">Tidak Ada Dokumen Ditemukan</p>
                        <p className="text-[11px] text-slate-500">
                            Siswa Anda belum mengunggah dokumen apapun.
                        </p>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 shrink-0 mt-0.5">
                                        <FileText className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-slate-900">{doc.studentName}</span>
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.2 rounded">
                                                {doc.programTypeName}
                                            </span>
                                        </div>

                                        <h3 className="text-xs font-semibold text-slate-800 mt-1">{doc.documentTitle}</h3>

                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Diunggah: {new Date(doc.uploadedAt).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badges & Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 justify-between sm:justify-end">
                                    <a
                                        href={`/api/documents/${doc.id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                                    >
                                        <span>Download File</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                    {(doc.status === "SUBMITTED" || doc.status === "UNDER_REVIEW") && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                            <AlertCircle className="w-3.5 h-3.5" /> Sedang Diproses
                                        </span>
                                    )}

                                    {doc.status === "APPROVED" && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                                        </span>
                                    )}

                                    {doc.status === "REVISION_REQUIRED" && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                            <XCircle className="w-3.5 h-3.5" /> Perlu Revisi
                                        </span>
                                    )}

                                    {doc.status === "REJECTED" && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                            <XCircle className="w-3.5 h-3.5" /> Ditolak
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tampilkan Catatan Revisi jika status REVISION_REQUIRED */}
                            {(doc.status === "REVISION_REQUIRED" || doc.status === "REJECTED") && doc.revisionNote && (
                                <div className="flex gap-2 items-start bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-900">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Catatan dari Prosesor:</p>
                                        <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">{doc.revisionNote}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}