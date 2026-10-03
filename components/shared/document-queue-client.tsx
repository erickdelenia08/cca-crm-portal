"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    FileText,
    Eye,
    X,
    CheckCircle2,
    History,
    AlertTriangle,
    ExternalLink,
} from "lucide-react";
import { updateDocumentStatus } from "@/actions/document.action";

type DocumentStatus = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "REVISION_REQUIRED";


import { getProcessorDocuments } from "@/actions/document.action";

type ProcessorDocumentsResponse =
    Awaited<ReturnType<typeof getProcessorDocuments>>;

type DocumentData = NonNullable<
    ProcessorDocumentsResponse["data"]
>[number];

interface DocumentQueueClientProps {
    initialDocuments: DocumentData[];
}

export function DocumentQueueClient({
    initialDocuments,
}: DocumentQueueClientProps) {
    const [documents, setDocuments] = useState<DocumentData[]>(initialDocuments);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
    const [revisionNote, setRevisionNote] = useState("");
    const [attachedResultFile, setAttachedResultFile] = useState<File | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Filter Logic
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            (doc.client.name && doc.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            doc.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const statusSteps: DocumentStatus[] = [
        "SUBMITTED",
        "UNDER_REVIEW",
        "REVISION_REQUIRED",
        "APPROVED",
        "REJECTED"
    ];

    const getStatusBadgeColors = (status: DocumentStatus) => {
        switch (status) {
            case "APPROVED": return "bg-emerald-100 text-emerald-800";
            case "REVISION_REQUIRED": return "bg-rose-100 text-rose-800";
            case "REJECTED": return "bg-red-100 text-red-800";
            case "UNDER_REVIEW": return "bg-amber-100 text-amber-800";
            case "SUBMITTED": return "bg-blue-100 text-blue-800";
            default: return "bg-slate-100 text-slate-800";
        }
    };

    const getStatusLabel = (status: DocumentStatus) => {
        switch (status) {
            case "SUBMITTED": return "Uploaded";
            case "UNDER_REVIEW": return "Under Review";
            case "REVISION_REQUIRED": return "Needs Revision";
            case "APPROVED": return "Approved";
            case "REJECTED": return "Rejected";
            default: return status;
        }
    };

    const handleUpdateStatus = async (newStatus: DocumentStatus) => {
        if (!selectedDoc) return;
        setIsUpdating(true);

        const fileName = attachedResultFile ? attachedResultFile.name : undefined;
        const res = await updateDocumentStatus(selectedDoc.id, newStatus, revisionNote, fileName);

        setIsUpdating(false);

        if (res.success) {
            alert(`Status dokumen diperbarui ke: ${getStatusLabel(newStatus)}`);

            // Optimistic update
            const updatedHistoryEntry = {
                id: `opt-${crypto.randomUUID()}`,
                status: newStatus,
                note: revisionNote || null,
                createdAt: new Date(),
                documentId: selectedDoc.id,
                updatedById: "local-user",
                updatedBy: { name: "Anda", role: "PROCESSING_DEPARTMENT" as const }
            };

            const updatedDoc = {
                ...selectedDoc,
                status: newStatus,
                revisionNote: newStatus === "REVISION_REQUIRED" ? revisionNote : selectedDoc.revisionNote,
                outcomeObjectKey: fileName || selectedDoc.outcomeObjectKey,
                history: [updatedHistoryEntry, ...selectedDoc.history]
            };

            setDocuments(docs => docs.map(doc => doc.id === selectedDoc.id ? (updatedDoc as unknown as typeof selectedDoc) : doc));
            setSelectedDoc(updatedDoc as unknown as typeof selectedDoc);
            if (newStatus !== "REVISION_REQUIRED") setRevisionNote("");
        } else {
            alert(res.error || "Gagal memperbarui status dokumen");
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(date));
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Antrian Dokumen (Document Queue)</h1>
                <p className="text-sm text-slate-500 mt-1">Verifikasi, proses, dan perbarui status dokumen persyaratan siswa.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari siswa atau ID dokumen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">Semua Status</option>
                        {statusSteps.map(status => (
                            <option key={status} value={status}>{getStatusLabel(status)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID & Siswa</th>
                                <th className="p-4">Jenis Dokumen</th>
                                <th className="p-4">Nama File Upload</th>
                                <th className="p-4">Tanggal Upload</th>
                                <th className="p-4">Status Saat Ini</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        Tidak ada dokumen yang ditemukan.
                                    </td>
                                </tr>
                            ) : filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{doc.client.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{doc.id}</p>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800">{doc.requirement.name}</td>
                                    <td className="p-4 text-blue-600 underline truncate max-w-[200px]">{doc.clientDocument?.fileName || "-"}</td>
                                    <td className="p-4 text-slate-500">{formatDate(doc.createdAt)}</td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeColors(doc.status)}`}
                                        >
                                            {getStatusLabel(doc.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedDoc(doc)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Verifikasi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedDoc && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                    {selectedDoc.id}
                                </span>
                                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedDoc.requirement.name}</h2>
                                <p className="text-xs text-slate-500">Siswa: {selectedDoc.client.name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Alur Tahapan Status
                            </label>
                            <div className="flex items-center gap-1 overflow-x-auto py-2">
                                {statusSteps.map((step) => {
                                    const isCurrent = selectedDoc.status === step;
                                    return (
                                        <button
                                            key={step}
                                            disabled={isUpdating}
                                            onClick={() => handleUpdateStatus(step)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${isCurrent
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                                } disabled:opacity-50 cursor-pointer`}
                                        >
                                            {getStatusLabel(step)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                File Dokumen Siswa
                            </label>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{selectedDoc.clientDocument?.fileName || "-"}</p>
                                        <p className="text-[10px] text-slate-400">Diupload: {formatDate(selectedDoc.createdAt)}</p>
                                    </div>
                                </div>
                                <a
                                    href={`/api/files/${selectedDoc.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Preview File
                                </a>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Catatan Revisi / Penolakan
                            </label>
                            <textarea
                                rows={3}
                                value={revisionNote}
                                onChange={(e) => setRevisionNote(e.target.value)}
                                placeholder="Tuliskan catatan perbaikan untuk siswa..."
                                className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:border-blue-500 resize-none"
                            ></textarea>
                            <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus("REVISION_REQUIRED")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <AlertTriangle className="w-3.5 h-3.5" /> Minta Revisi ke Siswa
                            </button>
                        </div>

                        <div className="space-y-2 border-t border-slate-100 pt-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Upload Hasil Pengurusan / Terjemahan (Opsional)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    onChange={(e) => setAttachedResultFile(e.target.files?.[0] || null)}
                                    className="text-xs border border-slate-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            {selectedDoc.outcomeObjectKey && (
                                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> File terlampir: {selectedDoc.outcomeObjectKey}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 border-t border-slate-100 pt-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <History className="w-3.5 h-3.5" /> Riwayat Audit Trail
                            </label>
                            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 divide-y divide-slate-100">
                                {selectedDoc.history.map((h, idx) => (
                                    <div key={idx} className="pt-2 first:pt-0 text-[11px] space-y-0.5">
                                        <div className="flex justify-between font-bold text-slate-800">
                                            <span>Status: {getStatusLabel(h.status)}</span>
                                            <span className="text-slate-400 font-normal">{formatDate(h.createdAt)}</span>
                                        </div>
                                        <p className="text-slate-500">Oleh: {h.updatedBy.name} ({h.updatedBy.role})</p>
                                        {h.note && <p className="text-amber-700 italic mt-0.5">Catatan: {h.note}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
