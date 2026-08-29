"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    TrendingUp,
    CalendarCheck,
    FileBarChart,
    Clock,
    UserCheck,
    UserX,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ShieldAlert,
} from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();

    // Mock Data Metrik Utama (KPI)
    const kpiMetrics = [
        {
            title: "Total Calon Siswa",
            value: "1,248",
            change: "+12.5% bulan ini",
            isPositive: true,
            icon: Users,
            color: "text-blue-600 bg-blue-50 border-blue-200",
        },
        {
            title: "Tingkat Konversi",
            value: "68.4%",
            change: "+3.2% dari target",
            isPositive: true,
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        },
        {
            title: "Rasio Kehadiran Les/Konsultasi",
            value: "94.2%",
            change: "-0.8% minggu ini",
            isPositive: false,
            icon: CalendarCheck,
            color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        },
    ];

    // Mock Data Bottleneck Analysis (Beban Kerja Dokumen per Tahap)
    const documentBottlenecks = [
        { stage: "Uploaded", count: 24, percentage: 22, color: "bg-blue-500" },
        { stage: "Verification", count: 12, percentage: 11, color: "bg-amber-500" },
        { stage: "Processing by Admin", count: 38, percentage: 35, isBottleneck: true, color: "bg-rose-500" },
        { stage: "Submitted", count: 9, percentage: 8, color: "bg-indigo-500" },
        { stage: "Approved", count: 26, percentage: 24, color: "bg-emerald-500" },
    ];

    // Mock Data Ringkasan Presensi Staf Hari Ini
    const todayAttendance = {
        totalStaff: 45,
        present: 38,
        late: 4,
        onLeave: 3,
    };

    // Mock Data Approval Pending (Shortcut Izin/Cuti/Lembur)
    const [pendingApprovals, setPendingApprovals] = useState([
        {
            id: "REQ-102",
            staffName: "Dewi Lestari",
            role: "Tim Pengolah",
            type: "Cuti Tahunan",
            dateRange: "01 Sep - 03 Sep 2026",
            reason: "Acara keluarga di luar kota",
        },
        {
            id: "REQ-105",
            staffName: "Budi Santoso",
            role: "Konsultan",
            type: "Lembur",
            dateRange: "29 Agu 2026 (3 Jam)",
            reason: "Sesi konseling intensif persiapan beasiswa",
        },
        {
            id: "REQ-108",
            staffName: "Rian Hidayat",
            role: "Tim Pengolah",
            type: "Izin Sakit",
            dateRange: "29 Agu 2026",
            reason: "Pemeriksaan medis rutin",
        },
    ]);

    const handleAction = (id: string, action: "approve" | "reject") => {
        setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
        alert(`Permohonan ${id} telah di-${action === "approve" ? "setujui" : "tolak"}.`);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard Manajemen
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Ringkasan performa operasional, beban kerja tim, dan persetujuan mendesak.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Update Terakhir: Sabtu, 29 Agu 2026
                </div>
            </div>

            {/* SECTION 1: Metrik Utama (KPI Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {kpiMetrics.map((metric, idx) => {
                    const IconComponent = metric.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {metric.title}
                                </span>
                                <div className={`p-2 rounded-lg border ${metric.color}`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-extrabold text-slate-900">{metric.value}</h3>
                                <p
                                    className={`text-xs font-semibold mt-1 ${metric.isPositive ? "text-emerald-600" : "text-rose-600"
                                        }`}
                                >
                                    {metric.change}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SECTION 2: Grid 2 Kolom (Monitoring Operasional & Presensi Staf) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monitoring Operasional — Bottleneck Analysis (2 Kolom) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <FileBarChart className="w-5 h-5 text-blue-600" />
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Monitoring Operasional Dokumen
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Analisis penumpukan beban kerja per tahap dari Dept. Pengolah
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/processing")}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                            Buka Portal Pengolah <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Bar Chart Visual & List Tahap */}
                    <div className="space-y-4 pt-2">
                        {documentBottlenecks.map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                        {item.stage}
                                        {item.isBottleneck && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                                <ShieldAlert className="w-3 h-3" /> Bottleneck
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {item.count} Dokumen ({item.percentage}%)
                                    </span>
                                </div>

                                {/* Progress Bar Visual */}
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ringkasan Presensi Hari Ini (1 Kolom) */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="border-b border-slate-100 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-600" /> Presensi Staf Hari Ini
                            </h2>
                            <p className="text-xs text-slate-500">
                                Total {todayAttendance.totalStaff} Staf Terdaftar
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-4">
                            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                                    <UserCheck className="w-4 h-4 text-emerald-600" /> Hadir Tepat Waktu
                                </div>
                                <span className="text-base font-extrabold text-emerald-900">
                                    {todayAttendance.present}
                                </span>
                            </div>

                            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                                    <Clock className="w-4 h-4 text-amber-600" /> Terlambat
                                </div>
                                <span className="text-base font-extrabold text-amber-900">
                                    {todayAttendance.late}
                                </span>
                            </div>

                            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold">
                                    <UserX className="w-4 h-4 text-blue-600" /> Izin / Cuti
                                </div>
                                <span className="text-base font-extrabold text-blue-900">
                                    {todayAttendance.onLeave}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/admin/attendance")}
                        className="w-full text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-colors mt-4"
                    >
                        Lihat Detail Presensi
                    </button>
                </div>
            </div>

            {/* SECTION 3: Approval Pending (Shortcut Persetujuan) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Persetujuan Menunggu (Approval Pending)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pengajuan izin, cuti, dan lembur staf yang membutuhkan keputusan Anda.
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto">
                        {pendingApprovals.length} Pengajuan Pending
                    </span>
                </div>

                {/* Tabel Persetujuan */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID & Staf</th>
                                <th className="p-4">Jenis Pengajuan</th>
                                <th className="p-4">Tanggal / Durasi</th>
                                <th className="p-4">Alasan</th>
                                <th className="p-4 text-right">Keputusan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingApprovals.length > 0 ? (
                                pendingApprovals.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{req.staffName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {req.role} • {req.id}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800">{req.dateRange}</td>
                                        <td className="p-4 text-slate-500 max-w-xs truncate">{req.reason}</td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, "reject")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                                                >
                                                    <XCircle className="w-3.5 h-3.5 text-rose-500" /> Tolak
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, "approve")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-400 text-xs">
                                        Tidak ada pengajuan yang menunggu persetujuan saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}