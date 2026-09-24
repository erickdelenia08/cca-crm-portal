"use client";

import { useState } from "react";
import {
    ArrowLeft, Plus, Layers, BookOpen, FileCheck,
    Edit2, Trash2, ChevronRight, CheckCircle2, AlertCircle, X
} from "lucide-react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================

export interface DocumentReq {
    id: string;
    name: string;
    isMandatory: boolean;
}

export interface ServiceItem {
    id: string;
    code: string;
    name: string;
    type: "PROGRAM" | "COURSE";
    price: number;
    // Khusus PROGRAM
    documentRequirements?: DocumentReq[];
    // Khusus COURSE
    level?: string;
    durationHours?: number;
}

// Dummy Data Servis di dalam 1 Brand (Misal: CCABROAD)
const MOCK_SERVICES: ServiceItem[] = [
    {
        id: "srv-1",
        code: "VISA_STUDENT_AU",
        name: "Student Visa Australia (Subclass 500)",
        type: "PROGRAM",
        price: 8500000,
        documentRequirements: [
            { id: "doc-1", name: "Paspor Masih Berlaku (Min 6 Bulan)", isMandatory: true },
            { id: "doc-2", name: "CoE (Confirmation of Enrolment)", isMandatory: true },
            { id: "doc-3", name: "Proof of Funds (Rekening Koran 3 Bulan)", isMandatory: true },
            { id: "doc-4", name: "Sertifikat Asuransi OSHC", isMandatory: false },
        ],
    },
    {
        id: "srv-2",
        code: "IELTS_INTENSIVE",
        name: "IELTS Academic Preparation",
        type: "COURSE",
        price: 3500000,
        level: "INTERMEDIATE",
        durationHours: 40,
    },
];

export default function BrandDetailPage() {
    const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
    const [activeTab, setActiveTab] = useState<"ALL" | "PROGRAM" | "COURSE">("ALL");
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    // State untuk Modal Dokumen
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [newDocName, setNewDocName] = useState("");
    const [isMandatory, setIsMandatory] = useState(true);

    // Filter Servis berdasarkan Tab
    const filteredServices = services.filter((s) => {
        if (activeTab === "ALL") return true;
        return s.type === activeTab;
    });

    // Handler Tambah Dokumen Syarat
    const handleAddDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService || !newDocName) return;

        const newDoc: DocumentReq = {
            id: `doc-${Date.now()}`,
            name: newDocName,
            isMandatory,
        };

        setServices((prev) =>
            prev.map((s) => {
                if (s.id === selectedService.id) {
                    const existingDocs = s.documentRequirements || [];
                    return { ...s, documentRequirements: [...existingDocs, newDoc] };
                }
                return s;
            })
        );

        // Update selected service state juga
        setSelectedService((prev) =>
            prev
                ? {
                    ...prev,
                    documentRequirements: [...(prev.documentRequirements || []), newDoc],
                }
                : null
        );

        setNewDocName("");
        setIsDocModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header & Back Button */}
            <div>
                <Link
                    href="/management/brands"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3 transition"
                >
                    <ArrowLeft size={14} /> Kembali ke Daftar Brand
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">
                                CCABROAD
                            </span>
                            <h1 className="text-2xl font-bold text-slate-800">
                                CCA Abroad Services
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola seluruh katalog layanan visa, pendaftaran universitas, dan kelas pelatihan di divisi ini.
                        </p>
                    </div>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition shadow-sm">
                        <Plus size={16} /> Tambah Servis Baru
                    </button>
                </div>
            </div>

            {/* Tab Filter */}
            <div className="flex border-b border-slate-200 text-sm font-semibold text-slate-500 gap-6">
                <button
                    onClick={() => setActiveTab("ALL")}
                    className={`pb-3 border-b-2 transition ${activeTab === "ALL"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent hover:text-slate-800"
                        }`}
                >
                    Semua Servis ({services.length})
                </button>
                <button
                    onClick={() => setActiveTab("PROGRAM")}
                    className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${activeTab === "PROGRAM"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent hover:text-slate-800"
                        }`}
                >
                    <Layers size={15} /> Program & Visa (
                    {services.filter((s) => s.type === "PROGRAM").length})
                </button>
                <button
                    onClick={() => setActiveTab("COURSE")}
                    className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${activeTab === "COURSE"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent hover:text-slate-800"
                        }`}
                >
                    <BookOpen size={15} /> Kelas & Pelatihan (
                    {services.filter((s) => s.type === "COURSE").length})
                </button>
            </div>

            {/* Grid Layout: Kiri Daftar Servis, Kanan Detail / Syarat Dokumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Daftar Servis */}
                <div className="lg:col-span-2 space-y-3">
                    {filteredServices.map((srv) => (
                        <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center ${selectedService?.id === srv.id
                                    ? "border-indigo-600 ring-1 ring-indigo-600"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-slate-500">
                                        {srv.code}
                                    </span>
                                    {srv.type === "PROGRAM" ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 flex items-center gap-1">
                                            <Layers size={11} /> Program
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 flex items-center gap-1">
                                            <BookOpen size={11} /> Course
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800">{srv.name}</h4>
                                <p className="text-xs text-slate-500">
                                    Harga:{" "}
                                    <strong className="text-emerald-600">
                                        Rp {srv.price.toLocaleString("id-ID")}
                                    </strong>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-slate-400">
                                {srv.type === "PROGRAM" && (
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                                        <FileCheck size={13} /> {srv.documentRequirements?.length || 0} Syarat
                                    </span>
                                )}
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kolom Kanan: Panel Detail & Syarat Dokumen */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
                    {selectedService ? (
                        <div className="space-y-5">
                            <div>
                                <span className="text-[11px] font-mono font-bold text-indigo-600">
                                    {selectedService.code}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {selectedService.name}
                                </h3>
                            </div>

                            {/* TAMPILAN KHUSUS TIPE PROGRAM: SYARAT DOKUMEN */}
                            {selectedService.type === "PROGRAM" && (
                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                            <FileCheck size={14} className="text-indigo-600" /> Syarat Dokumen
                                        </h4>
                                        <button
                                            onClick={() => setIsDocModalOpen(true)}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            + Syarat Baru
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {selectedService.documentRequirements?.length === 0 ? (
                                            <p className="text-xs text-slate-400">Belum ada syarat dokumen.</p>
                                        ) : (
                                            selectedService.documentRequirements?.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                                                >
                                                    <span className="font-medium text-slate-700">
                                                        {doc.name}
                                                    </span>
                                                    {doc.isMandatory ? (
                                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                                            Wajib
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                                                            Opsional
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAMPILAN KHUSUS TIPE COURSE: KELOLA KELAS */}
                            {selectedService.type === "COURSE" && (
                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <BookOpen size={14} className="text-emerald-600" /> Detail Kursus
                                    </h4>
                                    <div className="text-xs space-y-2 text-slate-600">
                                        <p>Level: <strong>{selectedService.level}</strong></p>
                                        <p>Durasi Total: <strong>{selectedService.durationHours} Jam</strong></p>
                                    </div>
                                    <Link
                                        href={`/management/courses/${selectedService.id}/classes`}
                                        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs flex justify-center items-center gap-1.5 transition"
                                    >
                                        Kelola Jadwal & Kelas <ChevronRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-xs">
                            Pilih salah satu servis di sebelah kiri untuk melihat detail & mengelola dokumen.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL TAMBAH SYARAT DOKUMEN */}
            {isDocModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-sm">Tambah Syarat Dokumen</h3>
                            <button onClick={() => setIsDocModalOpen(false)}>
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddDocument} className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Dokumen
                                </label>
                                <input
                                    type="text"
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    placeholder="Contoh: Rekening Koran 3 Bulan"
                                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="mandatory"
                                    checked={isMandatory}
                                    onChange={(e) => setIsMandatory(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="mandatory" className="text-xs text-slate-700 font-medium">
                                    Dokumen Wajib (Mandatory)
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsDocModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg font-semibold"
                                >
                                    Simpan Dokumen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}