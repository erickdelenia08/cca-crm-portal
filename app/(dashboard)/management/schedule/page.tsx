"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon,
    Users,
    Video,
    Clock,
    Plus,
    Search,
    Filter,
    BookOpen,
    GraduationCap,
    Plane,
    Languages,
    UserCheck,
    MoreVertical,
    CheckCircle2
} from "lucide-react";

type ScheduleType = "CONSULTATION" | "CLASS";

interface ScheduleItem {
    id: string;
    title: string;
    program: "STUDY_ABROAD" | "WHV" | "ENGLISH_COURSE" | "MANDARIN_COURSE";
    assignedPerson: string; // Konsultan atau Pengajar
    studentCountOrName: string; // "Ahmad Rizky" atau "12 Siswa (Batch 4)"
    time: string;
    date: string;
    platform: "Zoom Meeting" | "In-Person / Office";
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export default function IntegratedScheduleManagement() {
    const [activeTab, setActiveTab] = useState<ScheduleType>("CONSULTATION");
    const [searchQuery, setSearchQuery] = useState("");

    // Sample Data Jadwal Konsultasi & Kelas
    const [schedules] = useState<ScheduleItem[]>([
        {
            id: "SCH-101",
            title: "Sesi Konsultasi Beasiswa Australia (Monash)",
            program: "STUDY_ABROAD",
            assignedPerson: "Sarah Jenkins, M.Ed (Konsultan)",
            studentCountOrName: "Budi Santoso",
            time: "09:00 - 10:00 WIB",
            date: "2026-09-12",
            platform: "Zoom Meeting",
            status: "SCHEDULED",
        },
        {
            id: "SCH-102",
            title: "Verifikasi Dokumen & Tabungan WHV Subclass 462",
            program: "WHV",
            assignedPerson: "Rian Hidayat (Processor)",
            studentCountOrName: "Siti Rahmawati",
            time: "11:00 - 12:00 WIB",
            date: "2026-09-12",
            platform: "In-Person / Office",
            status: "SCHEDULED",
        },
        {
            id: "SCH-201",
            title: "IELTS Preparation: Writing Task 2 (Batch 8)",
            program: "ENGLISH_COURSE",
            assignedPerson: "John Doe, CELTA (Native Teacher)",
            studentCountOrName: "15 Siswa",
            time: "14:00 - 16:00 WIB",
            date: "2026-09-12",
            platform: "Zoom Meeting",
            status: "SCHEDULED",
        },
        {
            id: "SCH-202",
            title: "Mandarin Basic HSK 2: Speaking & Hanzi (Batch 3)",
            program: "MANDARIN_COURSE",
            assignedPerson: "Laoshi Chen Wei",
            studentCountOrName: "10 Siswa",
            time: "18:30 - 20:00 WIB",
            date: "2026-09-12",
            platform: "Zoom Meeting",
            status: "SCHEDULED",
        },
    ]);

    // Filter berdasarkan Tab Akses (Konsultasi vs Kelas Bahasa)
    const filteredSchedules = schedules.filter((item) => {
        const isTabMatch =
            activeTab === "CONSULTATION"
                ? item.program === "STUDY_ABROAD" || item.program === "WHV"
                : item.program === "ENGLISH_COURSE" || item.program === "MANDARIN_COURSE";

        const isSearchMatch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.studentCountOrName.toLowerCase().includes(searchQuery.toLowerCase());

        return isTabMatch && isSearchMatch;
    });

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">

            {/* Header Management */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-100 px-2.5 py-1 rounded-md">
                        Management Full Access
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                        Pusat Jadwal Konsultasi & Kelas Bahasa
                    </h1>
                    <p className="text-xs text-slate-500">
                        Kelola seluruh agenda konsultan, pengajar, dan sesi siswa lintas 4 program utama.
                    </p>
                </div>

                {/* Action Button Admin */}
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-2xs">
                        <Plus className="w-4 h-4" />
                        <span>+ Buat Jadwal Baru</span>
                    </button>
                </div>
            </div>

            {/* Switcher Tab: Konsultasi VS Kelas Bahasa */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    onClick={() => setActiveTab("CONSULTATION")}
                    className={`pb-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${activeTab === "CONSULTATION"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <GraduationCap className="w-4 h-4" />
                    <span>Jadwal Konsultasi (Study Abroad & WHV)</span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                        {schedules.filter((s) => s.program === "STUDY_ABROAD" || s.program === "WHV").length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("CLASS")}
                    className={`pb-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${activeTab === "CLASS"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <Languages className="w-4 h-4" />
                    <span>Jadwal Kelas Bahasa (English & Mandarin)</span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                        {schedules.filter((s) => s.program === "ENGLISH_COURSE" || s.program === "MANDARIN_COURSE").length}
                    </span>
                </button>
            </div>

            {/* Control Bar: Search & Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari siswa, konsultan, guru, atau topik..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Filter Status
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Hari Ini: 11 Sep 2026</span>
                </div>
            </div>

            {/* List / Grid Jadwal Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 hover:border-blue-300 transition-all space-y-4"
                    >
                        {/* Header Item */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.program === "STUDY_ABROAD"
                                            ? "bg-purple-100 text-purple-700"
                                            : item.program === "WHV"
                                                ? "bg-amber-100 text-amber-700"
                                                : item.program === "ENGLISH_COURSE"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                        }`}
                                >
                                    {item.program.replace("_", " ")}
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                            </div>

                            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info Penugasan & Peserta */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                    {activeTab === "CONSULTATION" ? "Konsultan / Mentor" : "Pengajar / Teacher"}
                                </span>
                                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                    {item.assignedPerson}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                    {activeTab === "CONSULTATION" ? "Klien / Siswa" : "Jumlah Peserta"}
                                </span>
                                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                    <Users className="w-3.5 h-3.5 text-blue-600" />
                                    {item.studentCountOrName}
                                </span>
                            </div>
                        </div>

                        {/* Jam & Platform */}
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                            <div className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                                <Video className="w-3.5 h-3.5" />
                                <span>{item.platform}</span>
                            </div>
                        </div>

                        {/* Footer Control Admin */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Ready / Confirm
                            </span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]">
                                    Reschedule
                                </button>
                                <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px]">
                                    Gabung Sesi
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}