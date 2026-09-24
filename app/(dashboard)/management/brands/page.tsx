"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Building2, X, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

// ============================================================
// TYPES & INTERFACES
// ============================================================

export interface BrandData {
    id: string; // Kode Unik Brand (misal: CCABROAD)
    name: string; // Nama Lengkap Divisi
    description?: string;
    badgeBg: string;
    badgeText: string;
    borderAccent: string;
    isActive: boolean;
    serviceCount?: number; // Jumlah servis di dalam brand
}

// Dummy Data Awal
const INITIAL_BRANDS: BrandData[] = [
    {
        id: "CCABROAD",
        name: "CCA Abroad",
        description: "Layanan konsultasi studi luar negeri, pendaftaran universitas, dan pengurusan visa pelajar.",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
        borderAccent: "hover:border-blue-300",
        isActive: true,
        serviceCount: 5,
    },
    {
        id: "CCADVISORY",
        name: "CCA Advisory",
        description: "Layanan perencanaan finansial, bukti kecukupan dana (proof of funds), dan proteksi siswa.",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        borderAccent: "hover:border-amber-300",
        isActive: true,
        serviceCount: 3,
    },
    {
        id: "CCACADEMY",
        name: "CCA Academy",
        description: "Pelatihan bahasa asing, persiapan tes sertifikasi IELTS/TOEFL, & kelas keahlian profesional.",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        borderAccent: "hover:border-emerald-300",
        isActive: true,
        serviceCount: 8,
    },
];

// Opsi Pilihan Warna Badge UI
const COLOR_OPTIONS = [
    { label: "Biru (Abroad)", bg: "bg-blue-50", text: "text-blue-700", border: "hover:border-blue-300" },
    { label: "Amber / Kuning (Advisory)", bg: "bg-amber-50", text: "text-amber-700", border: "hover:border-amber-300" },
    { label: "Hijau (Academy)", bg: "bg-emerald-50", text: "text-emerald-700", border: "hover:border-emerald-300" },
    { label: "Ungu (Tech/Inovasi)", bg: "bg-purple-50", text: "text-purple-700", border: "hover:border-purple-300" },
    { label: "Merah / Rose (Karir)", bg: "bg-rose-50", text: "text-rose-700", border: "hover:border-rose-300" },
    { label: "Cyan (Digital)", bg: "bg-cyan-50", text: "text-cyan-700", border: "hover:border-cyan-300" },
];

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function BrandsPage() {
    const [brands, setBrands] = useState<BrandData[]>(INITIAL_BRANDS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandData | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form State
    const [codeId, setCodeId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);

    // Handler Modal Open
    const handleOpenCreateModal = () => {
        setSelectedBrand(undefined);
        setCodeId("");
        setName("");
        setDescription("");
        setSelectedColorIdx(0);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, brand: BrandData) => {
        e.preventDefault(); // Mencegah pindah halaman saat klik tombol edit
        e.stopPropagation();
        setSelectedBrand(brand);
        setCodeId(brand.id);
        setName(brand.name);
        setDescription(brand.description || "");

        const colorIdx = COLOR_OPTIONS.findIndex(
            (c) => c.bg === brand.badgeBg && c.text === brand.badgeText
        );
        setSelectedColorIdx(colorIdx !== -1 ? colorIdx : 0);
        setIsModalOpen(true);
    };

    // Handler Delete
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Mencegah pindah halaman saat klik tombol delete
        e.stopPropagation();
        if (!confirm(`Apakah Anda yakin ingin menghapus divisi ${id}?`)) return;
        setIsDeleting(id);
        try {
            setBrands((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            alert("Gagal menghapus brand");
        } finally {
            setIsDeleting(null);
        }
    };

    // Handler Submit Form
    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const colorConfig = COLOR_OPTIONS[selectedColorIdx];

        if (selectedBrand) {
            // Edit Brand
            setBrands((prev) =>
                prev.map((b) =>
                    b.id === selectedBrand.id
                        ? {
                            ...b,
                            name,
                            description,
                            badgeBg: colorConfig.bg,
                            badgeText: colorConfig.text,
                            borderAccent: colorConfig.border,
                        }
                        : b
                )
            );
        } else {
            // Tambah Brand Baru
            const newBrand: BrandData = {
                id: codeId.toUpperCase().trim(),
                name,
                description,
                badgeBg: colorConfig.bg,
                badgeText: colorConfig.text,
                borderAccent: colorConfig.border,
                isActive: true,
                serviceCount: 0,
            };
            setBrands((prev) => [...prev, newBrand]);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Divisi & Brand CCA</h1>
                    <p className="text-sm text-slate-500">
                        Pilih divisi di bawah untuk mengelola layanan & syarat dokumennya
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition shadow-sm"
                >
                    <Plus size={16} /> Tambah Divisi Baru
                </button>
            </div>

            {/* Grid Cards Divisi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {brands.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                        Belum ada divisi/brand yang terdaftar.
                    </div>
                ) : (
                    brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/management/brands/${brand.id}`}
                            className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${brand.borderAccent}`}
                        >
                            <div>
                                {/* Header Card: Badge & Status */}
                                <div className="flex justify-between items-start mb-3">
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-md font-bold tracking-wider font-mono ${brand.badgeBg} ${brand.badgeText}`}
                                    >
                                        {brand.id}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 size={12} /> Aktif
                                    </span>
                                </div>

                                {/* Judul & Deskripsi */}
                                <h3 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-indigo-600 transition flex items-center justify-between">
                                    {brand.name}
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                                    {brand.description || "Tidak ada deskripsi layanan."}
                                </p>
                            </div>

                            {/* Action Buttons & Service Counter */}
                            <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                    {brand.serviceCount || 0} Servis
                                </span>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => handleOpenEditModal(e, brand)}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                        title="Edit Divisi"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, brand.id)}
                                        disabled={isDeleting === brand.id}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                        title="Hapus Divisi"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* MODAL FORM INPUT / EDIT BRAND */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Building2 size={18} className="text-indigo-600" />
                                {selectedBrand ? "Edit Divisi CCA" : "Tambah Divisi CCA Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    ID / Kode Unik Divisi
                                </label>
                                <input
                                    type="text"
                                    value={codeId}
                                    onChange={(e) => setCodeId(e.target.value.toUpperCase())}
                                    placeholder="CCATECH"
                                    disabled={!!selectedBrand}
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono disabled:bg-slate-100 disabled:text-slate-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Lengkap Divisi
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="CCA Tech & Bootcamp"
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Aksen Warna Label Card
                                </label>
                                <select
                                    value={selectedColorIdx}
                                    onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    {COLOR_OPTIONS.map((c, idx) => (
                                        <option key={idx} value={idx}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Deskripsi Layanan Divisi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Penjelasan mengenai bidang layanan divisi ini..."
                                    rows={3}
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
                                >
                                    {selectedBrand ? "Simpan Perubahan" : "Buat Divisi Baru"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}   