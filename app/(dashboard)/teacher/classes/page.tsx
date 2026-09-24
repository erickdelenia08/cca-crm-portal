"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Users,
    Clock,
    MapPin,
    PlusCircle,
    ChevronRight,
    BookOpen,
    Calendar,
    CheckCircle2
} from "lucide-react";

interface ClassItem {
    id: string;
    code: string;
    name: string;
    level: string;
    schedule: string;
    room: string;
    totalStudents: number;
    isToday: boolean;
    status: "ACTIVE" | "COMPLETED";
}

const dummyClasses: ClassItem[] = [
    {
        id: "ielts-b12",
        code: "IELTS-B12",
        name: "IELTS Intensive",
        level: "Intermediate - Advanced",
        schedule: "Senin & Rabu, 09:00 - 10:30 WIB",
        room: "Ruang 201",
        totalStudents: 15,
        isToday: true,
        status: "ACTIVE",
    },
    {
        id: "toefl-a04",
        code: "TOEFL-A04",
        name: "TOEFL Preparation",
        level: "Intermediate",
        schedule: "Selasa & Kamis, 13:00 - 14:30 WIB",
        room: "Lab Bahasa 1",
        totalStudents: 20,
        isToday: false,
        status: "ACTIVE",
    },
    {
        id: "eng-biz-01",
        code: "BIZ-ENG-01",
        name: "Business English for Professionals",
        level: "Upper Intermediate",
        schedule: "Jumat, 15:30 - 17:30 WIB",
        room: "Ruang Executive",
        totalStudents: 12,
        isToday: false,
        status: "ACTIVE",
    },
    {
        id: "gen-eng-09",
        code: "GEN-ENG-09",
        name: "General English Foundation",
        level: "Basic",
        schedule: "Sabtu, 08:30 - 10:30 WIB",
        room: "Ruang 103",
        totalStudents: 18,
        isToday: true,
        status: "ACTIVE",
    },
];

export default function TeacherClassesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState<"ALL" | "TODAY">("ALL");

    // Filter logika kelas
    const filteredClasses = dummyClasses.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterTab === "TODAY") {
            return matchesSearch && item.isToday;
        }
        return matchesSearch;
    });

    const totalStudentsCount = dummyClasses.reduce(
        (acc, item) => acc + item.totalStudents,
        0
    );
    const todayClassesCount = dummyClasses.filter((item) => item.isToday).length;

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Daftar Kelas Ajar
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola kelas, catat presensi harian, dan pantau kehadiran siswa Anda.
                    </p>
                </div>
            </div>

            {/* Ringkasan Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Total Kelas Active</p>
                        <p className="text-xl font-bold text-slate-900">{dummyClasses.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Jadwal Hari Ini</p>
                        <p className="text-xl font-bold text-slate-900">{todayClassesCount} Sesi</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Total Siswa Bimbingan</p>
                        <p className="text-xl font-bold text-slate-900">{totalStudentsCount} Siswa</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau kode kelas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Tab Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setFilterTab("ALL")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterTab === "ALL"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        Semua Kelas
                    </button>
                    <button
                        onClick={() => setFilterTab("TODAY")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterTab === "TODAY"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        Hari Ini
                    </button>
                </div>
            </div>

            {/* Grid List Kelas */}
            {filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClasses.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-3">
                                {/* Header Card */}
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                            {item.code}
                                        </span>
                                        <h2 className="text-base font-bold text-slate-900 mt-1.5">
                                            {item.name}
                                        </h2>
                                        <p className="text-xs text-slate-400 font-medium">{item.level}</p>
                                    </div>
                                    {item.isToday && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            Ada Sesi Hari Ini
                                        </span>
                                    )}
                                </div>

                                {/* Detail Information */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.room}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.totalStudents} Terdaftar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Footer */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                <Link
                                    href={`/teacher/classes/${item.id}/session`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Input Presensi</span>
                                </Link>

                                <Link
                                    href={`/teacher/classes/${item.id}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
                                >
                                    <span>Detail</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">Tidak ada kelas ditemukan</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Tidak ada data kelas yang sesuai dengan kata kunci atau filter yang Anda pilih.
                    </p>
                </div>
            )}
        </div>
    );
}