"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";

interface Student {
    id: string;
    name: string;
    nisn: string;
}

type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALPA";

interface StudentAttendance extends Student {
    status: AttendanceStatus;
    note?: string;
}

const dummyStudents: Student[] = [
    { id: "s1", name: "Ahmad Rizky", nisn: "0012345678" },
    { id: "s2", name: "Biti Khadijah", nisn: "0012345679" },
    { id: "s3", name: "Citra Dewi", nisn: "0012345680" },
    { id: "s4", name: "Deni Pratama", nisn: "0012345681" },
    { id: "s5", name: "Eka Rahmawati", nisn: "0012345682" },
];

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AttendanceSessionPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const classId = resolvedParams.id;

    const [sessionTopic, setSessionTopic] = useState("");
    const [sessionDate, setSessionDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [attendance, setAttendance] = useState<StudentAttendance[]>(
        dummyStudents.map((s) => ({ ...s, status: "HADIR", note: "" }))
    );

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance((prev) =>
            prev.map((item) => (item.id === studentId ? { ...item, status } : item))
        );
    };

    const handleNoteChange = (studentId: string, note: string) => {
        setAttendance((prev) =>
            prev.map((item) => (item.id === studentId ? { ...item, note } : item))
        );
    };

    const handleQuickMarkAll = (status: AttendanceStatus) => {
        setAttendance((prev) => prev.map((item) => ({ ...item, status })));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted payload:", { classId, sessionDate, sessionTopic, attendance });
        alert("Presensi berhasil disimpan!");
    };

    const summary = {
        hadir: attendance.filter((a) => a.status === "HADIR").length,
        izin: attendance.filter((a) => a.status === "IZIN").length,
        sakit: attendance.filter((a) => a.status === "SAKIT").length,
        alpa: attendance.filter((a) => a.status === "ALPA").length,
    };

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/teacher/classes/${classId}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Detail Kelas
                </Link>
                <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    ID Kelas: {classId}
                </span>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pencatatan Presensi Sesi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Lengkapi materi pembahasan dan tandai status kehadiran siswa.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Informasi Sesi */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                        Informasi Pertemuan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tanggal Pertemuan
                            </label>
                            <input
                                type="date"
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                required
                                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Materi / Topik Pembahasan
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Speaking Part 2 - Monologue Strategy"
                                value={sessionTopic}
                                onChange={(e) => setSessionTopic(e.target.value)}
                                required
                                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Realtime Summary & Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            Hadir: {summary.hadir}
                        </span>
                        <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                            Izin: {summary.izin}
                        </span>
                        <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
                            Sakit: {summary.sakit}
                        </span>
                        <span className="text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                            Alpa: {summary.alpa}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Tandai Semua:</span>
                        <button
                            type="button"
                            onClick={() => handleQuickMarkAll("HADIR")}
                            className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                        >
                            Hadir
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickMarkAll("ALPA")}
                            className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                            Alpa
                        </button>
                    </div>
                </div>

                {/* Tabel List Siswa */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                    <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Daftar Siswa
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">
                            Total: {attendance.length} Siswa
                        </span>
                    </div>

                    {attendance.map((student) => (
                        <div
                            key={student.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                        >
                            <div>
                                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                                <p className="text-[11px] font-mono text-slate-400 mt-0.5">NISN: {student.nisn}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                    {(["HADIR", "IZIN", "SAKIT", "ALPA"] as AttendanceStatus[]).map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => handleStatusChange(student.id, st)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${student.status === st
                                                    ? st === "HADIR"
                                                        ? "bg-emerald-600 text-white"
                                                        : st === "IZIN"
                                                            ? "bg-amber-500 text-white"
                                                            : st === "SAKIT"
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-rose-600 text-white"
                                                    : "text-slate-600 hover:text-slate-900"
                                                }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Catatan..."
                                    value={student.note}
                                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                    className="text-xs border border-slate-200 rounded-lg p-2 w-full sm:w-40 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        <span>Simpan Presensi Pertemuan</span>
                    </button>
                </div>
            </form>
        </div>
    );
}