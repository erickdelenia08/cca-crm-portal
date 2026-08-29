"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Clock,
    UserCheck,
    UserX,
    FileSpreadsheet,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Download,
    Calendar,
} from "lucide-react";

// Tipe Data Presensi & Approval
type AttendanceStatus = "Hadir" | "Terlambat" | "Izin" | "Cuti" | "Sakit" | "Absen";

type StaffAttendance = {
    id: string;
    name: string;
    role: string;
    checkIn: string;
    checkOut: string;
    status: AttendanceStatus;
    latenessMinutes?: number;
};

type LeaveApproval = {
    id: string;
    staffName: string;
    role: string;
    type: "Izin" | "Sakit" | "Cuti" | "Lembur";
    dates: string;
    reason: string;
    submittedAt: string;
};

export default function AdminAttendancePage() {
    // Tab State
    const [activeTab, setActiveTab] = useState<"rekap" | "approval">("rekap");

    // Mock Data Presensi Hari Ini
    const [attendanceList] = useState<StaffAttendance[]>([
        {
            id: "STF-01",
            name: "Budi Santoso",
            role: "Konsultan Senior",
            checkIn: "07:55 WIB",
            checkOut: "17:02 WIB",
            status: "Hadir",
        },
        {
            id: "STF-02",
            name: "Dewi Lestari",
            role: "Tim Pengolah",
            checkIn: "08:18 WIB",
            checkOut: "-",
            status: "Terlambat",
            latenessMinutes: 18,
        },
        {
            id: "STF-03",
            name: "Rian Hidayat",
            role: "Tim Pengolah",
            checkIn: "-",
            checkOut: "-",
            status: "Sakit",
        },
        {
            id: "STF-04",
            name: "Siti Rahmawati",
            role: "Konsultan",
            checkIn: "07:50 WIB",
            checkOut: "-",
            status: "Hadir",
        },
    ]);

    // Mock Data Approval Pending
    const [approvals, setApprovals] = useState<LeaveApproval[]>([
        {
            id: "REQ-201",
            staffName: "Dewi Lestari",
            role: "Tim Pengolah",
            type: "Cuti",
            dates: "01 Sep 2026 - 03 Sep 2026",
            reason: "Acara keluarga di luar kota",
            submittedAt: "28 Agu 2026",
        },
        {
            id: "REQ-202",
            staffName: "Budi Santoso",
            role: "Konsultan Senior",
            type: "Lembur",
            dates: "29 Agu 2026 (3 Jam)",
            reason: "Konsultasi persiapan beasiswa malam hari",
            submittedAt: "29 Agu 2026",
        },
        {
            id: "REQ-203",
            staffName: "Rian Hidayat",
            role: "Tim Pengolah",
            type: "Sakit",
            dates: "29 Agu 2026",
            reason: "Demam dan flu berat (Surat Dokter Terlampir)",
            submittedAt: "29 Agu 2026",
        },
    ]);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");

    // Handler Approval
    const handleAction = (id: string, action: "Approved" | "Rejected") => {
        setApprovals((prev) => prev.filter((item) => item.id !== id));
        alert(`Pengajuan ${id} berhasil di-${action === "Approved" ? "setujui" : "tolak"}.`);
    };

    // Handler Export Laporan
    const handleExport = (format: "Excel" | "PDF") => {
        alert(`Mengunduh Rekap Presensi format ${format}...`);
    };

    // Filter Logic Rekap Presensi
    const filteredAttendance = attendanceList.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === "All" || item.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header & Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Presensi Staf & Approval Center
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Rekap kehadiran real-time, persetujuan izin/cuti/lembur, dan ekspor laporan berkala.
                    </p>
                </div>

                {/* Ekspor Laporan Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => handleExport("Excel")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel
                    </button>
                    <button
                        onClick={() => handleExport("PDF")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                        <FileText className="w-4 h-4" /> Ekspor PDF
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4">
                <button
                    onClick={() => setActiveTab("rekap")}
                    className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "rekap"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <Clock className="w-4 h-4" /> Rekap Kehadiran Real-time
                </button>
                <button
                    onClick={() => setActiveTab("approval")}
                    className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "approval"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Approval Center
                    {approvals.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            {approvals.length}
                        </span>
                    )}
                </button>
            </div>

            {/* TAB 1: REKAP KEHADIRAN REAL-TIME */}
            {activeTab === "rekap" && (
                <div className="space-y-4">
                    {/* Filter & Search Bar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 justify-between items-center">
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari staf atau ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                                <Filter className="w-3.5 h-3.5" /> Divisi:
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                            >
                                <option value="All">Semua Peran</option>
                                <option value="Konsultan Senior">Konsultan</option>
                                <option value="Tim Pengolah">Tim Pengolah</option>
                            </select>
                        </div>
                    </div>

                    {/* Tabel Real-time Presensi */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Staf</th>
                                        <th className="p-4">Jam Masuk</th>
                                        <th className="p-4">Keterlambatan</th>
                                        <th className="p-4">Jam Keluar</th>
                                        <th className="p-4">Status Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAttendance.map((staf) => (
                                        <tr key={staf.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-slate-900">{staf.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {staf.role} • {staf.id}
                                                </p>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-800">{staf.checkIn}</td>
                                            <td className="p-4">
                                                {staf.latenessMinutes ? (
                                                    <span className="text-rose-600 font-bold">
                                                        + {staf.latenessMinutes} Menit
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-slate-800">{staf.checkOut}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${staf.status === "Hadir"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : staf.status === "Terlambat"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-blue-100 text-blue-800"
                                                        }`}
                                                >
                                                    {staf.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: APPROVAL CENTER */}
            {activeTab === "approval" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900">
                            Persetujuan Pengajuan (Approval Pending)
                        </h2>
                        <p className="text-xs text-slate-500">
                            Pengajuan izin, sakit, cuti, dan lembur yang membutuhkan konfirmasi manajemen.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID & Nama Staf</th>
                                    <th className="p-4">Jenis Pengajuan</th>
                                    <th className="p-4">Tanggal / Durasi</th>
                                    <th className="p-4">Alasan</th>
                                    <th className="p-4 text-right">Keputusan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {approvals.length > 0 ? (
                                    approvals.map((req) => (
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
                                            <td className="p-4 font-medium text-slate-800">{req.dates}</td>
                                            <td className="p-4 text-slate-500 max-w-xs truncate">{req.reason}</td>
                                            <td className="p-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(req.id, "Rejected")}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Tolak
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, "Approved")}
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
                                            Tidak ada pengajuan permohonan yang menunggu persetujuan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}