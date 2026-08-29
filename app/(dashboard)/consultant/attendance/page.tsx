"use client";

import { useState } from "react";
import {
    Clock,
    LogIn,
    LogOut,
    Calendar,
    CheckCircle2,
    FileText,
    Send,
    AlertCircle,
} from "lucide-react";

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState<"history" | "leave">("history");

    // State Presensi Hari Ini
    const [clockInTime, setClockInTime] = useState<string | null>("08:00 WIB");
    const [clockOutTime, setClockOutTime] = useState<string | null>(null);

    // Form State Pengajuan Izin/Cuti
    const [leaveType, setLeaveType] = useState("cuti");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    // Mock Data Riwayat Presensi
    const attendanceHistory = [
        { date: "29 Agu 2026", clockIn: "08:00 WIB", clockOut: "--:--", status: "Hadir (Aktif)", duration: "Sedang Berlangsung" },
        { date: "28 Agu 2026", clockIn: "07:55 WIB", clockOut: "17:05 WIB", status: "Hadir", duration: "9 Jam 10 Menit" },
        { date: "27 Agu 2026", clockIn: "08:10 WIB", clockOut: "17:00 WIB", status: "Terlambat", duration: "8 Jam 50 Menit" },
        { date: "26 Agu 2026", clockIn: "--:--", clockOut: "--:--", status: "Cuti Disetujui", duration: "-" },
        { date: "25 Agu 2026", clockIn: "07:58 WIB", clockOut: "17:02 WIB", status: "Hadir", duration: "9 Jam 4 Menit" },
    ];

    // Mock Data Pengajuan Izin/Cuti
    const [leaveRequests, setLeaveRequests] = useState([
        { id: 1, type: "Cuti Tahunan", startDate: "26 Agu 2026", endDate: "26 Agu 2026", reason: "Urusan Keluarga", status: "Approved" },
        { id: 2, type: "Izin Sakit", startDate: "10 Jul 2026", endDate: "11 Jul 2026", reason: "Demam Tinggi (Surat Dokter Ada)", status: "Approved" },
        { id: 3, type: "Cuti Tahunan", startDate: "15 Sep 2026", endDate: "17 Sep 2026", reason: "Liburan Keluarga", status: "Pending" },
    ]);

    const handleClockIn = () => {
        const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
        setClockInTime(time);
    };

    const handleClockOut = () => {
        const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
        setClockOutTime(time);
    };

    const handleLeaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) return;

        const newRequest = {
            id: Date.now(),
            type: leaveType === "cuti" ? "Cuti Tahunan" : "Izin / Sakit",
            startDate,
            endDate,
            reason,
            status: "Pending",
        };

        setLeaveRequests([newRequest, ...leaveRequests]);
        setStartDate("");
        setEndDate("");
        setReason("");
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Mandiri Konsultan</h1>
                <p className="text-sm text-slate-500 mt-1">Kelola jam kerja harian dan pengajuan izin/cuti konsultan.</p>
            </div>

            {/* Widget Clock-In / Clock-Out Status Hari Ini */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            Sabtu, 29 Agustus 2026
                        </span>
                        <div className="flex items-center gap-3 mt-2">
                            <Clock className="w-6 h-6 text-slate-700" />
                            <div>
                                <p className="text-xs text-slate-500">Status Hari Ini</p>
                                <p className="text-base font-bold text-slate-900">
                                    {!clockInTime ? "Belum Presensi Masuk" : clockOutTime ? "Sesi Selesai (Sudah Clock-Out)" : "Sedang Bekerja (Aktif)"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                        {/* Display Clock-in Time */}
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-left">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Clock-In</p>
                            <p className="text-sm font-bold text-slate-800">{clockInTime || "--:--"}</p>
                        </div>

                        {/* Display Clock-out Time */}
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-left">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Clock-Out</p>
                            <p className="text-sm font-bold text-slate-800">{clockOutTime || "--:--"}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClockIn}
                                disabled={!!clockInTime}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                            >
                                <LogIn className="w-4 h-4" /> Clock In
                            </button>
                            <button
                                onClick={handleClockOut}
                                disabled={!clockInTime || !!clockOutTime}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                            >
                                <LogOut className="w-4 h-4" /> Clock Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Switcher */}
            <div className="flex border-b border-slate-200 space-x-6">
                <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-3 text-xs font-bold transition-all relative ${activeTab === "history"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Riwayat Presensi
                </button>
                <button
                    onClick={() => setActiveTab("leave")}
                    className={`pb-3 text-xs font-bold transition-all relative ${activeTab === "leave"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Pengajuan Izin & Cuti
                </button>
            </div>

            {/* Tab 1: Riwayat Presensi (Table) */}
            {activeTab === "history" && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Tanggal</th>
                                    <th className="p-4">Clock In</th>
                                    <th className="p-4">Clock Out</th>
                                    <th className="p-4">Durasi Kerja</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {attendanceHistory.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{row.date}</td>
                                        <td className="p-4">{row.clockIn}</td>
                                        <td className="p-4">{row.clockOut}</td>
                                        <td className="p-4">{row.duration}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.status.includes("Hadir")
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : row.status === "Terlambat"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Form & Riwayat Pengajuan Izin/Cuti */}
            {activeTab === "leave" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Pengajuan */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs h-fit">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" /> Form Pengajuan
                        </h2>
                        <form onSubmit={handleLeaveSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Pengajuan</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                                >
                                    <option value="cuti">Cuti Tahunan</option>
                                    <option value="sakit">Izin Sakit</option>
                                    <option value="keperluan">Izin Keperluan Khusus</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Alasan / Keterangan</label>
                                <textarea
                                    rows={3}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Tuliskan alasan pengajuan secara singkat..."
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-2xs"
                            >
                                <Send className="w-3.5 h-3.5" /> Kirim Pengajuan
                            </button>
                        </form>
                    </div>

                    {/* Riwayat Status Pengajuan */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                            Status Pengajuan Izin / Cuti
                        </h2>
                        <div className="space-y-3">
                            {leaveRequests.map((req) => (
                                <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900">{req.type}</span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-600 font-medium">
                                                {req.startDate} s/d {req.endDate}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{req.reason}</p>
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${req.status === "Approved"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : req.status === "Rejected"
                                                    ? "bg-rose-100 text-rose-800"
                                                    : "bg-amber-100 text-amber-800"
                                                }`}
                                        >
                                            {req.status === "Approved" ? (
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                            )}
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}