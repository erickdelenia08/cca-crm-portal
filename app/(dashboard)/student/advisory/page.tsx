"use client";

import { useState } from "react";
import {
    Compass,
    MessageSquare,
    FileCheck2,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    UserCheck,
    Send,
    AlertCircle
} from "lucide-react";

// Types eksplisit tanpa `any`
type AdvisoryCategory = "SCHOLARSHIP" | "ESSAY_REVIEW" | "UNIVERSITY_APPLICATION" | "VISA_ADVISORY";
type ActionItemStatus = "PENDING" | "COMPLETED";

interface AdvisoryService {
    id: string;
    category: AdvisoryCategory;
    title: string;
    description: string;
    iconName: string;
    status: "ACTIVE" | "AVAILABLE" | "COMPLETED";
}

interface ActionItem {
    id: string;
    title: string;
    dueDate: string;
    assignedBy: string;
    status: ActionItemStatus;
}

interface AdvisorySessionNote {
    id: string;
    date: string;
    topic: string;
    consultantName: string;
    summary: string;
}

export default function ClientAdvisoryPage() {
    const [activeTab, setActiveTab] = useState<"SERVICES" | "ACTION_ITEMS" | "NOTES">("SERVICES");
    const [selectedCategory, setSelectedCategory] = useState<AdvisoryCategory>("ESSAY_REVIEW");

    // Dedicated Consultant
    const assignedConsultant = {
        name: "Budi Santoso, M.Ed.",
        role: "Senior Overseas Education Consultant",
        specialization: "Scholarship & UK/Australia Admissions",
        avatar: "BS",
        email: "budi.santoso@education.com",
    };

    // Mock Data Layanan Bimbingan Klien
    const advisoryServices: AdvisoryService[] = [
        {
            id: "adv-1",
            category: "ESSAY_REVIEW",
            title: "Bimbingan Personal Statement & Essay",
            description: "Review komprehensif, proofreading, dan koreksi struktur narasi essay motivasi.",
            iconName: "FileCheck2",
            status: "ACTIVE",
        },
        {
            id: "adv-2",
            category: "SCHOLARSHIP",
            title: "Konsultasi & Strategi Beasiswa",
            description: "Pemetaan peluang beasiswa (LPDP, AAS, Chevening) & simulasi wawancara.",
            iconName: "Award",
            status: "ACTIVE",
        },
        {
            id: "adv-3",
            category: "UNIVERSITY_APPLICATION",
            title: "Pendampingan Aplikasi Kampus",
            description: "Pemeriksaan berkas portal pendaftaran kampus dan komunikasi dengan pihak admisi.",
            iconName: "BookOpen",
            status: "AVAILABLE",
        },
        {
            id: "adv-4",
            category: "VISA_ADVISORY",
            title: "Bimbingan & Pengurusan Visa Pelajar",
            description: "Pemeriksaan kecukupan finansial (Proof of Funds) dan submit portal imigrasi.",
            iconName: "Compass",
            status: "AVAILABLE",
        },
    ];

    // Mock Data Action Items (Tugas dari Konsultan)
    const [actionItems, setActionItems] = useState<ActionItem[]>([
        {
            id: "act-1",
            title: "Revisi Personal Statement Paragraf 2 (Fokus ke Kontribusi Karir)",
            dueDate: "12 Sep 2026",
            assignedBy: "Budi Santoso, M.Ed.",
            status: "PENDING",
        },
        {
            id: "act-2",
            title: "Minta Surat Rekomendasi dari Dosen Pembimbing S1",
            dueDate: "15 Sep 2026",
            assignedBy: "Budi Santoso, M.Ed.",
            status: "PENDING",
        },
        {
            id: "act-3",
            title: "Lengkapi Draft Curriculum Vitae (CV) Format Europass",
            dueDate: "05 Sep 2026",
            assignedBy: "Budi Santoso, M.Ed.",
            status: "COMPLETED",
        },
    ]);

    // Mock Catatan Sesi Konsultasi
    const sessionNotes: AdvisorySessionNote[] = [
        {
            id: "note-1",
            date: "08 Sep 2026",
            topic: "Review Final Personal Statement versi Draft 1",
            consultantName: "Budi Santoso, M.Ed.",
            summary: "Narasi paragraf pembuka sudah cukup kuat. Perlu menambahkan contoh konkret pencapaian akademis di paragraf kedua untuk memperkuat alasan memilih Jurusan Data Science di University of Melbourne.",
        },
        {
            id: "note-2",
            date: "01 Sep 2026",
            topic: "Mapping Universitas & Peluang Beasiswa AAS",
            consultantName: "Budi Santoso, M.Ed.",
            summary: "Disepakati 3 pilihan kampus target: Univ. of Melbourne (Pilihan 1), UNSW (Pilihan 2), Univ. of Queensland (Pilihan 3). Persyaratan skor IELTS overall minimal 6.5.",
        },
    ];

    const toggleActionItem = (id: string) => {
        setActionItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === "PENDING" ? "COMPLETED" : "PENDING" }
                    : item
            )
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Konsultan Pendamping */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {assignedConsultant.avatar}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-900">{assignedConsultant.name}</h1>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                                Dedicated Consultant
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{assignedConsultant.role}</p>
                        <p className="text-[11px] text-slate-400">{assignedConsultant.specialization}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <a
                        href="/student/booking"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Jadwalkan Konsultasi</span>
                    </a>
                </div>
            </div>

            {/* Segmented Control Navigasi Tab */}
            <div className="flex items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("SERVICES")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "SERVICES"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Layanan Bimbingan
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("ACTION_ITEMS")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "ACTION_ITEMS"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Tugas & Action Items ({actionItems.filter((i) => i.status === "PENDING").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("NOTES")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "NOTES"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Catatan Bimbingan ({sessionNotes.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: LAYANAN BIMBINGAN (SERVICES) */}
            {activeTab === "SERVICES" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advisoryServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4 space-y-2 hover:border-slate-300 transition-colors"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                                        {service.category === "ESSAY_REVIEW" && <FileCheck2 className="w-5 h-5" />}
                                        {service.category === "SCHOLARSHIP" && <Award className="w-5 h-5" />}
                                        {service.category === "UNIVERSITY_APPLICATION" && <BookOpen className="w-5 h-5" />}
                                        {service.category === "VISA_ADVISORY" && <Compass className="w-5 h-5" />}
                                    </span>

                                    {service.status === "ACTIVE" ? (
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                            Sesi Aktif
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            Tersedia
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400 font-medium">
                                    Pendamping: {assignedConsultant.name}
                                </span>
                                <a
                                    href="/student/booking"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                                >
                                    <span>Ajukan Sesi</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 2: TUGAS & ACTION ITEMS */}
            {activeTab === "ACTION_ITEMS" && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Tugas Tindak Lanjut Pasca Bimbingan</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Selesaikan tugas di bawah ini agar proses pendaftaran berjalan tepat waktu.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        {actionItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => toggleActionItem(item.id)}
                                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${item.status === "COMPLETED"
                                    ? "bg-slate-50 border-slate-200 opacity-60"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={item.status === "COMPLETED"}
                                    onChange={() => { }} // handled by parent onClick
                                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                />
                                <div className="space-y-1 flex-1">
                                    <p
                                        className={`text-xs font-semibold ${item.status === "COMPLETED" ? "line-through text-slate-500" : "text-slate-900"
                                            }`}
                                    >
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" /> Tenggat: {item.dueDate}
                                        </span>
                                        <span>•</span>
                                        <span>Pemberi Tugas: {item.assignedBy}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: CATATAN BIMBINGAN (NOTES) */}
            {activeTab === "NOTES" && (
                <div className="space-y-3">
                    {sessionNotes.map((note) => (
                        <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-900">{note.topic}</span>
                                <span className="text-[11px] font-semibold text-slate-500">{note.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{note.summary}</p>
                            <p className="text-[11px] text-slate-400 pt-1">
                                Konsultan: <span className="font-semibold text-slate-700">{note.consultantName}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}