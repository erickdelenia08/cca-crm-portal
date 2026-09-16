"use client";

import Link from "next/link";
import {
    Calendar,
    Clock,
    Video,
    FileCheck2,
    Users,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    Globe,
    Building2,
    MapPin
} from "lucide-react";

export default function TeacherDashboardPage() {
    const todayClasses = [
        {
            id: "c1",
            name: "IELTS Intensive - Batch 3",
            module: "Writing Task 2: Opinion Essay",
            time: "10:00 - 12:00 WIB",
            studentsCount: 12,
            mode: "ONLINE",
            locationOrLink: "https://zoom.us/j/987654321",
            status: "UPCOMING",
        },
        {
            id: "c2",
            name: "TOEFL Prep - Class A1",
            module: "Listening Section: Academic Lectures",
            time: "14:00 - 16:00 WIB",
            studentsCount: 15,
            mode: "OFFLINE",
            locationOrLink: "Ruang 302 - Gedung Utama Lt. 3",
            status: "UPCOMING",
        },
    ];

    const pendingHomework = [
        {
            id: "hw1",
            title: "Task 2 Essay Draft - Academic Writing",
            className: "IELTS Intensive - Batch 3",
            submittedCount: 10,
            totalStudents: 12,
            dueDate: "Hari Ini, 23:59",
        },
        {
            id: "hw2",
            title: "Reading Practice #4: Matching Headings",
            className: "TOEFL Prep - Class A1",
            submittedCount: 8,
            totalStudents: 15,
            dueDate: "Besok, 18:00",
        },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Selamat Datang, Sensei / Tutor! 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Berikut adalah ringkasan jadwal mengajar dan status evaluasi PR siswa Anda hari ini.
                    </p>
                </div>
                <Link
                    href="/teacher/classes"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-xs self-start sm:self-auto"
                >
                    <Calendar className="w-4 h-4" /> Kelola Jadwal Kelas
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Kelas Hari Ini</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">2 Sesi</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Total Siswa Aktif</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">27 Siswa</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">PR Perlu Diperiksa</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">18 Tugas</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Modul Terupload</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">14 Berkas</p>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Jadwal Mengajar */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Jadwal Mengajar Hari Ini
                        </h2>
                        <Link
                            href="/teacher/classes"
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                            Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {todayClasses.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                                            {c.name}
                                        </span>

                                        {/* Badge Mode Pembelajaran (Online / Offline) */}
                                        {c.mode === "ONLINE" ? (
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Online
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> Offline
                                            </span>
                                        )}

                                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {c.studentsCount} Siswa
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900">{c.module}</h3>

                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.time}
                                        </span>

                                        {/* Informasi Lokasi jika kelas Offline */}
                                        {c.mode === "OFFLINE" && (
                                            <span className="flex items-center gap-1 text-slate-700 font-bold">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {c.locationOrLink}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Aksi Berdasarkan Mode Kelas */}
                                {c.mode === "ONLINE" ? (
                                    <a
                                        href={c.locationOrLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shrink-0"
                                    >
                                        <Video className="w-4 h-4 text-emerald-400" /> Masuk Zoom
                                    </a>
                                ) : (
                                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-2.5 rounded-lg shrink-0 flex items-center gap-1.5 justify-center">
                                        <Building2 className="w-4 h-4 text-emerald-600" /> Tatap Muka
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Column: Homework & Approval Status */}
                <div className="space-y-5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck2 className="w-5 h-5 text-amber-600" />
                        Status PR & Penugasan
                    </h2>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                        {pendingHomework.map((hw) => (
                            <div key={hw.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{hw.title}</h4>
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                                        {hw.submittedCount}/{hw.totalStudents} Terkumpul
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500">{hw.className}</p>
                                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                                    <span className="text-slate-400">Batas: {hw.dueDate}</span>
                                    <Link
                                        href="/teacher/materials"
                                        className="font-bold text-blue-600 hover:underline"
                                    >
                                        Periksa →
                                    </Link>
                                </div>
                            </div>
                        ))}

                        <Link
                            href="/teacher/materials"
                            className="block text-center text-xs font-bold text-slate-600 hover:text-slate-900 pt-2"
                        >
                            Kelola Semua Tugas & PR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}