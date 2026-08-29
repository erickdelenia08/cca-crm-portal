"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Filter,
    CheckCircle2,
    FileUp,
    Search,
    UserCheck,
    Send,
} from "lucide-react";

export default function ProcessingDashboardPage() {
    const router = useRouter();

    // Mock Data Ringkasan Beban Kerja Harian
    const statusSummary = [
        {
            id: "Uploaded",
            label: "Uploaded",
            count: 24,
            desc: "Dokumen baru masuk",
            color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400",
            icon: FileUp,
        },
        {
            id: "Verification",
            label: "Verification",
            count: 12,
            desc: "Menunggu verifikasi awal",
            color: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400",
            icon: Search,
        },
        {
            id: "Processing",
            label: "Processing by Admin",
            count: 18,
            desc: "Sedang diolah tim admin",
            color: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400",
            icon: UserCheck,
        },
        {
            id: "Submitted",
            label: "Submitted",
            count: 9,
            desc: "Telah diajukan ke sistem",
            color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400",
            icon: Send,
        },
        {
            id: "Approved",
            label: "Approved",
            count: 45,
            desc: "Selesai disetujui",
            color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400",
            icon: CheckCircle2,
        },
    ];

    // Mock Data Antrian Prioritas (Dokumen tertahan > 3 Hari / Bottleneck)
    const priorityQueue = [
        {
            id: "DOC-9921",
            studentName: "Siti Rahmawati",
            docType: "Transkrip Nilai Legalisir",
            stage: "Verification",
            waitingDays: 5,
            assignee: "Budi Santoso",
        },
        {
            id: "DOC-9844",
            studentName: "Ahmad Fauzi",
            docType: "Sertifikat TOEFL iBT",
            stage: "Processing by Admin",
            waitingDays: 4,
            assignee: "Dewi Lestari",
        },
        {
            id: "DOC-9710",
            studentName: "Rian Hidayat",
            docType: "Surat Rekomendasi Akademik",
            stage: "Uploaded",
            waitingDays: 4,
            assignee: "Unassigned",
        },
        {
            id: "DOC-9655",
            studentName: "Nadia Putri",
            docType: "Personal Statement & Essay",
            stage: "Processing by Admin",
            waitingDays: 4,
            assignee: "Budi Santoso",
        },
    ];

    // Quick Link Functionality: Klik kartu status -> redirect & filter ke Document Queue
    const handleFilterClick = (statusId: string) => {
        // Navigasi ke halaman Document Queue dengan parameter query filter status
        router.push(`/processing/documents?status=${encodeURIComponent(statusId)}`);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard Tim Pengolah
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Pantau ringkasan beban kerja harian dan cegah keterlambatan alur dokumen.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Update Terakhir: Sabtu, 29 Agu 2026 (08:30 WIB)
                </div>
            </div>

            {/* SECTION 1: Kartu Ringkasan Per Tahap (Quick Link to Filter Queue) */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                    Ringkasan Status Dokumen (Klik untuk memfilter antrian)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statusSummary.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleFilterClick(item.id)}
                                className={`p-4 rounded-xl border bg-white shadow-2xs transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md ${item.color}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="p-2 rounded-lg bg-white/80 border border-slate-100 shadow-2xs">
                                            <IconComponent className="w-4 h-4" />
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {item.label}
                                    </h3>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">
                                        {item.count} <span className="text-xs font-normal text-slate-400">dokumen</span>
                                    </p>
                                </div>

                                <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-100 pt-2">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: Antrian Prioritas (Bottleneck Handler) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Antrian Prioritas (Tertahan &gt; 3 Hari)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Daftar dokumen yang memerlukan tindakan cepat untuk menghindari bottleneck.
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 self-start sm:self-auto">
                        {priorityQueue.length} Dokumen Perlu Atensi
                    </span>
                </div>

                {/* Tabel Antrian Prioritas */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID Dokumen</th>
                                <th className="p-4">Nama Siswa</th>
                                <th className="p-4">Jenis Dokumen</th>
                                <th className="p-4">Tahap Saat Ini</th>
                                <th className="p-4">Waktu Menunggu</th>
                                <th className="p-4">PIC Admin</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {priorityQueue.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-900">{doc.id}</td>
                                    <td className="p-4 font-semibold text-slate-800">{doc.studentName}</td>
                                    <td className="p-4">{doc.docType}</td>
                                    <td className="p-4">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            {doc.stage}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                            <Clock className="w-3 h-3" /> {doc.waitingDays} Hari
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-700 font-medium">{doc.assignee}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => router.push(`/processing/documents/${doc.id}`)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                                        >
                                            Proses Sekarang
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}