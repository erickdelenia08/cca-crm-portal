"use client";

import { useState } from "react";
import {
    FileSearch,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    Search,
    Filter,
    FileText,
    Clock,
    History,
    Send,
    User
} from "lucide-react";

// Types eksplisit tanpa `any`
type ProgramType = "ALL" | "STUDY_ABROAD" | "VISA_HOLIDAY" | "ENGLISH_COURSE" | "MANDARIN_COURSE";
type DocumentStatus = "PENDING_REVIEW" | "APPROVED" | "NEEDS_REVISION";

interface ConsultantDocumentItem {
    id: string;
    studentId: string;
    studentName: string;
    program: Exclude<ProgramType, "ALL">;
    documentTitle: string;
    category: string;
    uploadedAt: string;
    fileUrl: string;
    status: DocumentStatus;
    revisionNote?: string | null;
}

export default function ConsultantDocumentsPage() {
    const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");
    const [selectedProgram, setSelectedProgram] = useState<ProgramType>("ALL");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Modal State untuk Minta Revisi
    const [selectedDocForRevision, setSelectedDocForRevision] = useState<ConsultantDocumentItem | null>(null);
    const [revisionNoteInput, setRevisionNoteInput] = useState<string>("");

    // Mock Master Data Dokumen Masuk dari Siswa
    const [documents, setDocuments] = useState<ConsultantDocumentItem[]>([
        {
            id: "doc-101",
            studentId: "std-1",
            studentName: "John Doe",
            program: "STUDY_ABROAD",
            documentTitle: "Ijazah S1 & Transkrip Nilai Terjemahan",
            category: "AKADEMIK",
            uploadedAt: "09 Sep 2026, 09:30 WIB",
            fileUrl: "#",
            status: "PENDING_REVIEW",
        },
        {
            id: "doc-102",
            studentId: "std-2",
            studentName: "Siti Rahma",
            program: "VISA_HOLIDAY",
            documentTitle: "Bukti Kepemilikan Dana (Rekening Koran 3 Bulan)",
            category: "KEUANGAN & VISA",
            uploadedAt: "09 Sep 2026, 11:15 WIB",
            fileUrl: "#",
            status: "PENDING_REVIEW",
        },
        {
            id: "doc-103",
            studentId: "std-3",
            studentName: "Budi Pratama",
            program: "STUDY_ABROAD",
            documentTitle: "Draft Personal Statement / Motivation Letter v2",
            category: "ESSAY & REKOMENDASI",
            uploadedAt: "08 Sep 2026, 16:20 WIB",
            fileUrl: "#",
            status: "PENDING_REVIEW",
        },
        {
            id: "doc-104",
            studentId: "std-4",
            studentName: "Jessica Lee",
            program: "MANDARIN_COURSE",
            documentTitle: "Sertifikat HSK Level 3",
            category: "AKADEMIK",
            uploadedAt: "07 Sep 2026, 10:00 WIB",
            fileUrl: "#",
            status: "APPROVED",
        },
        {
            id: "doc-105",
            studentId: "std-5",
            studentName: "Ahmad Rizki",
            program: "ENGLISH_COURSE",
            documentTitle: "Hasil Placement Test IELTS Internal",
            category: "AKADEMIK",
            uploadedAt: "06 Sep 2026, 14:00 WIB",
            fileUrl: "#",
            status: "NEEDS_REVISION",
            revisionNote: "Halaman kedua hasil tes terpotong, mohon upload ulang berkas utuh.",
        },
    ]);

    // Filtering Dokumen
    const filteredDocuments = documents.filter((doc) => {
        // Filter Tab Status
        const matchesTab =
            activeTab === "PENDING"
                ? doc.status === "PENDING_REVIEW"
                : doc.status === "APPROVED" || doc.status === "NEEDS_REVISION";

        // Filter Program
        const matchesProgram = selectedProgram === "ALL" || doc.program === selectedProgram;

        // Filter Search Text
        const matchesSearch =
            doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesProgram && matchesSearch;
    });

    // Action Handlers
    const handleApprove = (id: string) => {
        setDocuments((prev) =>
            prev.map((doc) => (doc.id === id ? { ...doc, status: "APPROVED", revisionNote: null } : doc))
        );
    };

    const handleSubmitRevision = () => {
        if (!selectedDocForRevision || !revisionNoteInput.trim()) return;

        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === selectedDocForRevision.id
                    ? { ...doc, status: "NEEDS_REVISION", revisionNote: revisionNoteInput }
                    : doc
            )
        );

        setSelectedDocForRevision(null);
        setRevisionNoteInput("");
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Portal Verifikasi */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Verifikasi & Review Dokumen Siswa
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Periksa kelengkapan berkas pendaftaran kampus, persyaratkan visa, dan sertifikat kursus.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Antrean Aktif:</span>
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-full">
                            {documents.filter((d) => d.status === "PENDING_REVIEW").length} Berkas Menunggu
                        </span>
                    </div>
                </div>

                {/* Filter Toolbar: Program Filter & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    {/* Dropdown Filter Program */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value as ProgramType)}
                            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg p-2 text-slate-700 focus:outline-none focus:border-blue-600 w-full sm:w-auto"
                        >
                            <option value="ALL">Semua Program</option>
                            <option value="STUDY_ABROAD">Study Abroad</option>
                            <option value="VISA_HOLIDAY">Visa Holiday (WHV)</option>
                            <option value="ENGLISH_COURSE">English Course</option>
                            <option value="MANDARIN_COURSE">Mandarin Course</option>
                        </select>
                    </div>

                    {/* Quick Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama siswa / dokumen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                    </div>
                </div>
            </div>

            {/* Segmented Control Switcher Tab */}
            <div className="flex items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("PENDING")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "PENDING"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Menunggu Review ({documents.filter((d) => d.status === "PENDING_REVIEW").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "HISTORY"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Riwayat Verifikasi ({documents.filter((d) => d.status !== "PENDING_REVIEW").length})
                    </button>
                </div>
            </div>

            {/* List Dokumen */}
            <div className="space-y-3">
                {filteredDocuments.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
                        <FileSearch className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-900">Tidak Ada Dokumen Ditemukan</p>
                        <p className="text-[11px] text-slate-500">
                            Tidak ada berkas yang sesuai dengan kriteria filter yang Anda pilih.
                        </p>
                    </div>
                ) : (
                    filteredDocuments.map((doc) => (
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
                                                {doc.program.replace("_", " ")}
                                            </span>
                                        </div>

                                        <h3 className="text-xs font-semibold text-slate-800 mt-1">{doc.documentTitle}</h3>

                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Kategori: <span className="font-medium text-slate-600">{doc.category}</span> • Diunggah: {doc.uploadedAt}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badges & Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 justify-between sm:justify-end">
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                                    >
                                        <span>Buka File</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                    {doc.status === "PENDING_REVIEW" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDocForRevision(doc);
                                                    setRevisionNoteInput("");
                                                }}
                                                className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                                            >
                                                Minta Revisi
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleApprove(doc.id)}
                                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg"
                                            >
                                                Setujui (Approve)
                                            </button>
                                        </>
                                    )}

                                    {doc.status === "APPROVED" && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                                        </span>
                                    )}

                                    {doc.status === "NEEDS_REVISION" && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                            <XCircle className="w-3.5 h-3.5" /> Perlu Revisi Siswa
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tampilkan Catatan Revisi jika status NEEDS_REVISION */}
                            {doc.status === "NEEDS_REVISION" && doc.revisionNote && (
                                <div className="flex gap-2 items-start bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-900">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Catatan Revisi Ditentukan:</p>
                                        <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">{doc.revisionNote}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal Input Catatan Revisi */}
            {selectedDocForRevision && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-md w-full rounded-xl border border-slate-200 p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-900">Beri Catatan Revisi Berkas</h3>
                            <button
                                type="button"
                                onClick={() => setSelectedDocForRevision(null)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                                Batal
                            </button>
                        </div>

                        <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <p className="font-bold text-slate-900">{selectedDocForRevision.documentTitle}</p>
                            <p className="text-slate-500">Siswa: {selectedDocForRevision.studentName}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">
                                Instruksi Revisi Spesifik untuk Siswa:
                            </label>
                            <textarea
                                rows={4}
                                value={revisionNoteInput}
                                onChange={(e) => setRevisionNoteInput(e.target.value)}
                                placeholder="Contoh: Halaman stempel penerjemah tersumpah belum terlihat jelas, mohon scan ulang dengan resolusi lebih tinggi."
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedDocForRevision(null)}
                                className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={!revisionNoteInput.trim()}
                                onClick={handleSubmitRevision}
                                className={`px-4 py-2 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 ${!revisionNoteInput.trim()
                                    ? "bg-slate-300 cursor-not-allowed"
                                    : "bg-rose-600 hover:bg-rose-700"
                                    }`}
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Kirim Permintaan Revisi</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}