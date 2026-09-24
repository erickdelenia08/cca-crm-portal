"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Save,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Calendar,
    Clock,
    Video
} from "lucide-react";

interface StudentAttendance {
    id: string;
    name: string;
    studentId: string;
    status: "HADIR" | "IZIN" | "SAKIT" | "ALPA";
    note: string;
}

export default function ClassAttendancePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const classId = params.id as string;
    const sessionId = searchParams.get("sessionId") || "s3";

    // State Daftar Siswa & Presensi
    const [students, setStudents] = useState<StudentAttendance[]>([
        { id: "st1", name: "Ahmad Fauzi", studentId: "STD-2026-001", status: "HADIR", note: "" },
        { id: "st2", name: "Budi Santoso", studentId: "STD-2026-002", status: "HADIR", note: "" },
        { id: "st3", name: "Citra Dewi", studentId: "STD-2026-003", status: "IZIN", note: "Ada acara keluarga" },
        { id: "st4", name: "Dini Aminarti", studentId: "STD-2026-004", status: "SAKIT", note: "Surat dokter terlampir" },
        { id: "st5", name: "Eko Prasetyo", studentId: "STD-2026-005", status: "ALPA", note: "" },
    ]);

    const [isSaved, setIsSaved] = useState(false);

    // Update Status Kehadiran
    const handleStatusChange = (id: string, newStatus: StudentAttendance["status"]) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
    };

    // Update Catatan
    const handleNoteChange = (id: string, note: string) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, note } : s))
        );
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    // Ringkasan Kehadiran
    const summary = {
        hadir: students.filter((s) => s.status === "HADIR").length,
        izin: students.filter((s) => s.status === "IZIN").length,
        sakit: students.filter((s) => s.status === "SAKIT").length,
        alpa: students.filter((s) => s.status === "ALPA").length,
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto font-sans">
            {/* Header & Navigasi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        href={`/classes/${classId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2"
                    >
                        <ChevronLeft className="w-4 h-4" /> Kembali ke Detail Pertemuan
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Presensi Pertemuan 3
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Kelas: IELTS Intensive - Batch 12 (ID: {classId} | Sesi: {sessionId})
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
                >
                    <Save className="w-4 h-4" /> Simpan Presensi
                </button>
            </div>

            {/* Ringkasan & Info Sesi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Info Sesi */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Detail Pertemuan Hari Ini
                    </span>
                    <div className="text-xs text-slate-700 font-semibold space-y-1">
                        <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 16 September 2026
                        </p>
                        <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> 09:00 - 10:30 WIB
                        </p>
                        <p className="flex items-center gap-1.5 text-blue-600">
                            <Video className="w-3.5 h-3.5" /> Online (Zoom Meeting)
                        </p>
                    </div>
                </div>

                {/* Ringkasan Angka */}
                <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Ringkasan Presensi ({students.length} Siswa)
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-600 block">Hadir</span>
                            <span className="text-base font-bold text-emerald-700">{summary.hadir}</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                            <span className="text-[10px] font-bold text-amber-600 block">Izin</span>
                            <span className="text-base font-bold text-amber-700">{summary.izin}</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                            <span className="text-[10px] font-bold text-blue-600 block">Sakit</span>
                            <span className="text-base font-bold text-blue-700">{summary.sakit}</span>
                        </div>
                        <div className="bg-rose-50 p-2 rounded-xl border border-rose-100">
                            <span className="text-[10px] font-bold text-rose-600 block">Alpa</span>
                            <span className="text-base font-bold text-rose-700">{summary.alpa}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pesan Berhasil */}
            {isSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Data presensi berhasil disimpan ke dalam database!</span>
                </div>
            )}

            {/* Tabel Absensi */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">Daftar Kehadiran Siswa</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="py-3 px-4">Nama Siswa</th>
                                <th className="py-3 px-4">ID Siswa</th>
                                <th className="py-3 px-4 text-center">Status Kehadiran</th>
                                <th className="py-3 px-4">Catatan / Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-slate-900">{student.name}</td>
                                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                                        {student.studentId}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {/* Toggle Option Status */}
                                        <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl w-fit mx-auto border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, "HADIR")}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${student.status === "HADIR"
                                                        ? "bg-emerald-600 text-white shadow-2xs"
                                                        : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                <CheckCircle2 className="w-3 h-3" /> Hadir
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, "IZIN")}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${student.status === "IZIN"
                                                        ? "bg-amber-500 text-white shadow-2xs"
                                                        : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                <FileText className="w-3 h-3" /> Izin
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, "SAKIT")}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${student.status === "SAKIT"
                                                        ? "bg-blue-600 text-white shadow-2xs"
                                                        : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                <AlertCircle className="w-3 h-3" /> Sakit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, "ALPA")}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${student.status === "ALPA"
                                                        ? "bg-rose-600 text-white shadow-2xs"
                                                        : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                <XCircle className="w-3 h-3" /> Alpa
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            value={student.note}
                                            onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                            placeholder="Tambahkan catatan..."
                                            className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                                        />
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