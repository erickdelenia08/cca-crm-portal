"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ClassAttendanceHistoryPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const classId = resolvedParams.id;

    const sessions = [
        { id: "s1", date: "02/09" },
        { id: "s2", date: "07/09" },
        { id: "s3", date: "09/09" },
    ];

    const studentsHistory = [
        { name: "Ahmad Rizky", records: { s1: "H", s2: "H", s3: "H" }, percentage: 100 },
        { name: "Biti Khadijah", records: { s1: "H", s2: "I", s3: "H" }, percentage: 67 },
        { name: "Citra Dewi", records: { s1: "S", s2: "H", s3: "H" }, percentage: 67 },
        { name: "Deni Pratama", records: { s1: "H", s2: "H", s3: "A" }, percentage: 67 },
        { name: "Eka Rahmawati", records: { s1: "H", s2: "H", s3: "H" }, percentage: 100 },
    ];

    const getBadgeStyle = (status: string) => {
        switch (status) {
            case "H":
                return "bg-emerald-100 text-emerald-700";
            case "I":
                return "bg-amber-100 text-amber-700";
            case "S":
                return "bg-blue-100 text-blue-700";
            case "A":
                return "bg-rose-100 text-rose-700";
            default:
                return "bg-slate-100 text-slate-500";
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <Link
                    href={`/teacher/classes/${classId}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Detail Kelas
                </Link>
                <button
                    onClick={() => alert("Mengunduh Rekap Excel...")}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm"
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Ekspor Excel</span>
                </button>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Rekap Kehadiran Siswa
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Matriks presensi siswa untuk seluruh pertemuan yang telah terlaksana.
                </p>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="p-4 min-w-[180px]">Nama Siswa</th>
                            {sessions.map((s) => (
                                <th key={s.id} className="p-4 text-center min-w-[60px]">
                                    {s.date}
                                </th>
                            ))}
                            <th className="p-4 text-center min-w-[100px]">Tingkat Kehadiran</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                        {studentsHistory.map((student, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{student.name}</td>
                                {sessions.map((s) => {
                                    const status = student.records[s.id as keyof typeof student.records];
                                    return (
                                        <td key={s.id} className="p-4 text-center">
                                            <span
                                                className={`inline-block w-7 h-7 leading-7 rounded-lg text-xs font-bold ${getBadgeStyle(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className="p-4 text-center">
                                    <span
                                        className={`font-bold ${student.percentage >= 75
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                            }`}
                                    >
                                        {student.percentage}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda Keterangan */}
            <div className="flex items-center gap-4 text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Keterangan:</span>
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> H: Hadir
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> I: Izin
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> S: Sakit
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> A: Alpa
                </span>
            </div>
        </div>
    );
}