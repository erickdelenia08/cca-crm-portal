"use client";

import { useState } from "react";
import { Plus, Edit2, BookOpen, Trash2, Layers, FileText, Check, X } from "lucide-react";
import Link from "next/link";

// ============================================================
// TYPES & INTERFACES
// ============================================================

export interface ServiceData {
    id: string;
    code: string;
    name: string;
    brandName: "CCABROAD" | "CCADVISORY" | "CCACADEMY" | string;
    type: "PROGRAM_TYPE" | "COURSE";
    category?: string | null;
    level?: string | null;
    durationHours?: number | null;
    basePrice?: number | null;
    isActive: boolean;
    programTypeId?: string;
    documentCount?: number;
}

// Dummy Data untuk Testing UI
const MOCK_SERVICES: ServiceData[] = [
    {
        id: "pt-1",
        code: "VISITOR_VISA",
        name: "Visitor Visa Australia",
        brandName: "CCABROAD",
        type: "PROGRAM_TYPE",
        basePrice: 3500000,
        isActive: true,
        documentCount: 4,
    },
    {
        id: "pt-2",
        code: "FIN_PROOF",
        name: "Proof of Funds Assistance",
        brandName: "CCADVISORY",
        type: "PROGRAM_TYPE",
        basePrice: 5000000,
        isActive: true,
        documentCount: 2,
    },
    {
        id: "crs-1",
        code: "IELTS_PREP",
        name: "IELTS Preparation Intensive",
        brandName: "CCACADEMY",
        type: "COURSE",
        category: "LANGUAGE",
        level: "PREPARATION",
        durationHours: 30,
        basePrice: 2500000,
        isActive: true,
        programTypeId: "pt-3",
    },
];

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceData[]>(MOCK_SERVICES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceData | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form State untuk Modal Terpadu
    const [serviceType, setServiceType] = useState<"PROGRAM_TYPE" | "COURSE">("PROGRAM_TYPE");
    const [brand, setBrand] = useState<string>("CCABROAD");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [basePrice, setBasePrice] = useState<number | "">("");
    const [level, setLevel] = useState("BASIC");
    const [durationHours, setDurationHours] = useState<number | "">("");

    // Handler Open Modal
    const handleOpenCreateModal = () => {
        setSelectedService(undefined);
        setServiceType("PROGRAM_TYPE");
        setBrand("CCABROAD");
        setCode("");
        setName("");
        setBasePrice("");
        setLevel("BASIC");
        setDurationHours("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: ServiceData) => {
        setSelectedService(service);
        setServiceType(service.type);
        setBrand(service.brandName);
        setCode(service.code);
        setName(service.name);
        setBasePrice(service.basePrice || "");
        setLevel(service.level || "BASIC");
        setDurationHours(service.durationHours || "");
        setIsModalOpen(true);
    };

    // Handler Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
        setIsDeleting(id);
        try {
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            alert("Gagal menghapus layanan");
        } finally {
            setIsDeleting(null);
        }
    };

    // Handler Form Submit Modal Terpadu
    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedService) {
            // Edit Mode
            setServices((prev) =>
                prev.map((s) =>
                    s.id === selectedService.id
                        ? {
                            ...s,
                            code,
                            name,
                            brandName: brand,
                            type: serviceType,
                            basePrice: basePrice === "" ? null : Number(basePrice),
                            level: serviceType === "COURSE" ? level : null,
                            durationHours: serviceType === "COURSE" && durationHours !== "" ? Number(durationHours) : null,
                        }
                        : s
                )
            );
        } else {
            // Create Mode
            const newService: ServiceData = {
                id: `srv-${Date.now()}`,
                code,
                name,
                brandName: brand,
                type: serviceType,
                basePrice: basePrice === "" ? null : Number(basePrice),
                isActive: true,
                documentCount: serviceType === "PROGRAM_TYPE" ? 1 : 0,
                level: serviceType === "COURSE" ? level : null,
                durationHours: serviceType === "COURSE" && durationHours !== "" ? Number(durationHours) : null,
            };
            setServices((prev) => [newService, ...prev]);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manajemen Servis Terpadu</h1>
                    <p className="text-sm text-slate-500">
                        Kelola katalog program, jenis layanan, & kelas pelatihan CCA dalam satu tempat
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition shadow-sm"
                >
                    <Plus size={16} /> Tambah Servis
                </button>
            </div>

            {/* Tabel Catalog Servis */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="p-4">Kode</th>
                            <th className="p-4">Nama Servis / Layanan</th>
                            <th className="p-4">Divisi / Brand</th>
                            <th className="p-4">Tipe Modul</th>
                            <th className="p-4">Detail / Syarat</th>
                            <th className="p-4 text-right">Harga Dasar (Base Price)</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-500">
                                    Belum ada data servis.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id} className="hover:bg-slate-50 transition">
                                    {/* Kode */}
                                    <td className="p-4 font-mono font-bold text-slate-700">
                                        {service.code}
                                    </td>

                                    {/* Nama Servis */}
                                    <td className="p-4 font-semibold text-slate-900">
                                        {service.name}
                                    </td>

                                    {/* Brand Tag */}
                                    <td className="p-4">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-md font-medium ${service.brandName === "CCABROAD"
                                                ? "bg-blue-50 text-blue-700"
                                                : service.brandName === "CCADVISORY"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-emerald-50 text-emerald-700"
                                                }`}
                                        >
                                            {service.brandName}
                                        </span>
                                    </td>

                                    {/* Tipe Modul (ProgramType / Course) */}
                                    <td className="p-4">
                                        {service.type === "PROGRAM_TYPE" ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                                <Layers size={14} /> Program Type
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                                <BookOpen size={14} /> Course
                                            </span>
                                        )}
                                    </td>

                                    {/* Detail Info */}
                                    <td className="p-4 text-slate-600 text-xs">
                                        {service.type === "PROGRAM_TYPE" ? (
                                            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                                                <FileText size={14} /> {service.documentCount || 0} Syarat Dokumen
                                            </span>
                                        ) : (
                                            <span>
                                                {service.level || "BASIC"} • {service.durationHours || 0} Jam
                                            </span>
                                        )}
                                    </td>

                                    {/* Harga Dasar */}
                                    <td className="p-4 text-right font-extrabold text-emerald-600">
                                        {service.basePrice
                                            ? `Rp ${service.basePrice.toLocaleString("id-ID")}`
                                            : "-"}
                                    </td>

                                    {/* Tombol Aksi */}
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            {service.type === "COURSE" && (
                                                <Link
                                                    href={`/management/courses/${service.id}/classes`}
                                                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                                    title="Lihat Kelola Kelas"
                                                >
                                                    <BookOpen size={16} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleOpenEditModal(service)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                disabled={isDeleting === service.id}
                                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ============================================================ */}
            {/* MODAL INPUT / EDIT SERVIS TERPADU                            */}
            {/* ============================================================ */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">
                                {selectedService ? "Edit Master Servis" : "Tambah Master Servis Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
                            {/* Tab Switcher Tipe Servis */}
                            {!selectedService && (
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setServiceType("PROGRAM_TYPE");
                                            setBrand("CCABROAD");
                                        }}
                                        className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${serviceType === "PROGRAM_TYPE"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                            }`}
                                    >
                                        <Layers size={14} /> Layanan / Program Type
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setServiceType("COURSE");
                                            setBrand("CCACADEMY");
                                        }}
                                        className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${serviceType === "COURSE"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                            }`}
                                    >
                                        <BookOpen size={14} /> Kelas / Course
                                    </button>
                                </div>
                            )}

                            {/* Input Brand / Divisi */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Divisi / Parent Brand
                                </label>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    <option value="CCABROAD">CCABROAD (Study Overseas & Visa)</option>
                                    <option value="CCADVISORY">CCADVISORY (Finance & Protection)</option>
                                    <option value="CCACADEMY">CCACADEMY (Language & Training)</option>
                                </select>
                            </div>

                            {/* Grid Input Kode & Nama */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Kode Unik
                                    </label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder="VISITOR_VISA"
                                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Servis / Layanan
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Visitor Visa Australia"
                                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Dynamic Field khusus COURSE */}
                            {serviceType === "COURSE" && (
                                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Level Kursus
                                        </label>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-full text-sm px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="BASIC">Basic</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                            <option value="PREPARATION">Preparation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Durasi (Jam)
                                        </label>
                                        <input
                                            type="number"
                                            value={durationHours}
                                            onChange={(e) => setDurationHours(e.target.value === "" ? "" : Number(e.target.value))}
                                            placeholder="30"
                                            className="w-full text-sm px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Input Harga Dasar */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Harga Dasar / Base Price (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="3500000"
                                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Footer Modal Action */}
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
                                    {selectedService ? "Simpan Perubahan" : "Buat Servis"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}