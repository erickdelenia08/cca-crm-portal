"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    FileText,
    ShieldAlert,
    Eye,
    CheckCircle2,
    AlertTriangle,
    RotateCcw,
    ExternalLink,
    X,
    History,
    Lock,
    Download,
} from "lucide-react";

// Tipe Data Dokumen Global
type DocumentStatus =
    | "Uploaded"
    | "Verification"
    | "Processing by Admin"
    | "Submitted"
    | "Approved"
    | "Needs Revision"
    | "Rejected";

type AdminDocumentItem = {
    id: string;
    studentName: string;
    studentId: string;
    docType: string;
    fileName: string;
    uploadDate: string;
    status: DocumentStatus;
    fileUrl: string;
    processedFileUrl?: string;
    assignedProcessor: string;
    overrideHistory: { action: string; performedBy: string; timestamp: string; reason: string }[];
};

export default function AdminDocumentsPage() {
    // Mock Data Dokumen Oversight
    const [documents, setDocuments] = useState<AdminDocumentItem[]>([
        {
            id: "DOC-9921",
            studentName: "Siti Rahmawati",
            studentId: "STD-8801",
            docType: "Transkrip Nilai Legalisir",
            fileName: "Transkrip_Siti_Final.pdf",
            uploadDate: "24 Agu 2026",
            status: "Verification",
            fileUrl: "#",
            assignedProcessor: "Budi Santoso",
            overrideHistory: [],
        },
        {
            id: "DOC-9844",
            studentName: "Ahmad Fauzi",
            studentId: "STD-8804",
            docType: "Sertifikat TOEFL iBT",
            fileName: "TOEFL_Ahmad_2026.pdf",
            uploadDate: "25 Agu 2026",
            status: "Processing by Admin",
            fileUrl: "#",
            processedFileUrl: "TOEFL_Translated_Ahmad.pdf",
            assignedProcessor: "Dewi Lestari",
            overrideHistory: [],
        },
        {
            id: "DOC-9710",
            studentName: "Rian Hidayat",
            studentId: "STD-8799",
            docType: "Paspor Halaman Depan",
            fileName: "Passport_Rian_Expired.pdf",
            uploadDate: "20 Agu 2026",
            status: "Needs Revision",
            fileUrl: "#",
            assignedProcessor: "Dewi Lestari",
            overrideHistory: [
                {
                    action: "Status diubah ke Needs Revision",
                    performedBy: "Dewi Lestari (Pengolah)",
                    timestamp: "21 Agu 2026 14:00 WIB",
                    reason: "Masa berlaku paspor kurang dari 6 bulan",
                },
            ],
        },
    ]);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedDocType, setSelectedDocType] = useState<string>("All");

    // State Modal Manual Override
    const [selectedDocForOverride, setSelectedDocForOverride] = useState<AdminDocumentItem | null>(null);
    const [targetStatus, setTargetStatus] = useState<DocumentStatus>("Approved");
    const [overrideReason, setOverrideReason] = useState("");

    // Filter Logic
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
        const matchesType = selectedDocType === "All" || doc.docType === selectedDocType;
        return matchesSearch && matchesStatus && matchesType;
    });

    // Handler Manual Override
    const handleExecuteOverride = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDocForOverride || !overrideReason.trim()) {
            alert("Harap masukkan alasan override untuk keperluan audit trail.");
            return;
        }

        const timestamp = new Date().toLocaleString("id-ID") + " WIB";
        const newHistoryEntry = {
            action: `[MANUAL OVERRIDE] Status diubah ke ${targetStatus}`,
            performedBy: "Super Admin (Manajemen)",
            timestamp: timestamp,
            reason: overrideReason,
        };

        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === selectedDocForOverride.id
                    ? {
                        ...doc,
                        status: targetStatus,
                        overrideHistory: [newHistoryEntry, ...doc.overrideHistory],
                    }
                    : doc
            )
        );

        alert(`[Override Sukses] Status dokumen ${selectedDocForOverride.id} berhasil diubah ke ${targetStatus}.`);
        setSelectedDocForOverride(null);
        setOverrideReason("");
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Oversight Dokumen Sistem
                        </h1>
                        <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> Full Access
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Pengawasan tingkat manajemen untuk seluruh dokumen siswa dan fitur override status manual.
                    </p>
                </div>
            </div>

            {/* Ringkasan Status Dokumen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dokumen</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{documents.length}</h3>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dalam Proses</p>
                    <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                        {documents.filter((d) => d.status === "Processing by Admin" || d.status === "Verification").length}
                    </h3>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perlu Revisi</p>
                    <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                        {documents.filter((d) => d.status === "Needs Revision").length}
                    </h3>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disetujui (Approved)</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                        {documents.filter((d) => d.status === "Approved").length}
                    </h3>
                </div>
            </div>

            {/* Baris Filter & Pencarian */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari siswa, ID dokumen, atau NIM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Tahap Status</option>
                        <option value="Uploaded">Uploaded</option>
                        <option value="Verification">Verification</option>
                        <option value="Processing by Admin">Processing by Admin</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Needs Revision">Needs Revision</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Jenis Dokumen</option>
                        <option value="Transkrip Nilai Legalisir">Transkrip Nilai</option>
                        <option value="Sertifikat TOEFL iBT">Sertifikat Bahasa</option>
                        <option value="Paspor Halaman Depan">Paspor</option>
                    </select>
                </div>
            </div>

            {/* Tabel Oversight Dokumen */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Siswa & ID</th>
                                <th className="p-4">Jenis Dokumen</th>
                                <th className="p-4">File Upload</th>
                                <th className="p-4">Pengolah PIC</th>
                                <th className="p-4">Status Saat Ini</th>
                                <th className="p-4 text-right">Aksi Oversight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDocuments.length > 0 ? (
                                filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{doc.studentName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {doc.studentId} • {doc.id}
                                            </p>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800">{doc.docType}</td>
                                        <td className="p-4">
                                            <a
                                                href={doc.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 underline font-medium truncate max-w-[180px] inline-flex items-center gap-1"
                                            >
                                                <FileText className="w-3.5 h-3.5 shrink-0" /> {doc.fileName}
                                            </a>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-700">{doc.assignedProcessor}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${doc.status === "Approved"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : doc.status === "Needs Revision"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : doc.status === "Rejected"
                                                                ? "bg-rose-100 text-rose-800"
                                                                : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedDocForOverride(doc)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                                            >
                                                <ShieldAlert className="w-3.5 h-3.5" /> Manual Override
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-400 text-xs">
                                        Tidak ada dokumen yang sesuai dengan kriteria filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: MANUAL OVERRIDE STATUS (KASUS KHUSUS) */}
            {selectedDocForOverride && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <form
                        onSubmit={handleExecuteOverride}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden space-y-4"
                    >
                        {/* Modal Header */}
                        <div className="p-4 bg-rose-950 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-400" />
                                <h3 className="font-bold text-sm">Intervensi / Manual Override Status</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedDocForOverride(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-xs">
                            {/* Info Dokumen */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                                <p className="text-slate-500">
                                    Dokumen ID: <strong className="text-slate-800">{selectedDocForOverride.id}</strong>
                                </p>
                                <p className="text-slate-500">
                                    Siswa: <strong className="text-slate-800">{selectedDocForOverride.studentName}</strong>
                                </p>
                                <p className="text-slate-500">
                                    Jenis: <strong className="text-slate-800">{selectedDocForOverride.docType}</strong>
                                </p>
                                <p className="text-slate-500">
                                    Status Saat Ini:{" "}
                                    <span className="font-bold text-blue-600">{selectedDocForOverride.status}</span>
                                </p>
                            </div>

                            {/* Target Status Dropdown */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Pilih Status Baru (Force Override)
                                </label>
                                <select
                                    value={targetStatus}
                                    onChange={(e) => setTargetStatus(e.target.value as DocumentStatus)}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-rose-500"
                                >
                                    <option value="Approved">Approved (Paksa Setujui)</option>
                                    <option value="Needs Revision">Needs Revision (Minta Perbaikan)</option>
                                    <option value="Processing by Admin">Processing by Admin (Kembalikan ke Tim)</option>
                                    <option value="Rejected">Rejected (Tolak Permanen)</option>
                                </select>
                            </div>

                            {/* Alasan Override (Mandatori Audit Trail) */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Alasan Override Manajemen <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Jelaskan alasan pemaksaan perubahan status (mis. Dispensasi Khusus dari Direktur, Dokumen Fisik Terverifikasi Manual, dll.)"
                                    value={overrideReason}
                                    onChange={(e) => setOverrideReason(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:outline-hidden focus:border-rose-500 resize-none"
                                ></textarea>
                            </div>

                            {/* Riwayat Override Sebelumnya */}
                            {selectedDocForOverride.overrideHistory.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                        <History className="w-3 h-3" /> Audit Trail Sebelumnya
                                    </label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {selectedDocForOverride.overrideHistory.map((h, idx) => (
                                            <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px]">
                                                <p className="font-bold text-slate-800">{h.action}</p>
                                                <p className="text-slate-500">Alasan: {h.reason}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    Oleh {h.performedBy} • {h.timestamp}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedDocForOverride(null)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                            >
                                Eksekusi Override
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}