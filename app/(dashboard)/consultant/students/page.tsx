"use client";

import Link from "next/link";
import { Search, FileText, Clock, ChevronRight, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function MyStudentsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock Data Siswa Binaan
    const students = [
        {
            id: "S001",
            name: "Budi Santoso",
            program: "Master in Computer Science, TU Munich",
            lastSession: "28 Agu 2026",
            docStatus: { completed: 4, total: 5 },
            status: "Aktif",
        },
        {
            id: "S002",
            name: "Siti Rahma",
            program: "BSc Business Administration, UI",
            lastSession: "15 Agu 2026",
            docStatus: { completed: 5, total: 5 },
            status: "Aktif",
        },
        {
            id: "S003",
            name: "Andi Wijaya",
            program: "PhD Data Science, MIT",
            lastSession: "Belum ada sesi",
            docStatus: { completed: 1, total: 6 },
            status: "Onboarding",
        },
    ];

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Siswa Binaan Saya</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola data siswa, dokumen, dan log sesi konsultasi.</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-blue-500 w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Student List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                    <Link href={`/consultant/students/${student.id}`} key={student.id}>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {student.name}
                                    </h3>
                                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700">
                                        {student.status}
                                    </span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {student.name.charAt(0)}
                                </div>
                            </div>

                            <div className="space-y-2 flex-grow">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{student.program}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>Sesi Terakhir: <strong>{student.lastSession}</strong></span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-700">
                                        Dokumen: {student.docStatus.completed}/{student.docStatus.total}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}