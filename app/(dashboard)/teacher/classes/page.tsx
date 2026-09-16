// "use client";

// import { useState } from "react";
// import {
//     Video,
//     MapPin,
//     Calendar,
//     Clock,
//     Save,
//     Users,
//     CheckCircle2,
//     Plus,
//     Building2,
//     Globe
// } from "lucide-react";

// interface ClassSession {
//     id: string;
//     className: string;
//     program: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     mode: "ONLINE" | "OFFLINE";
//     locationOrLink: string;
//     createdBy: "MANAGEMENT" | "TEACHER";
//     totalStudents: number;
// }

// export default function TeacherClassesPage() {
//     const [sessions, setSessions] = useState<ClassSession[]>([
//         {
//             id: "s1",
//             className: "IELTS Intensive - Batch 3",
//             program: "IELTS Preparation",
//             date: "2026-09-12",
//             startTime: "10:00",
//             endTime: "12:00",
//             mode: "ONLINE",
//             locationOrLink: "https://zoom.us/j/987654321",
//             createdBy: "MANAGEMENT",
//             totalStudents: 12,
//         },
//         {
//             id: "s2",
//             className: "TOEFL Prep - Class A1",
//             program: "TOEFL iBT Mastery",
//             date: "2026-09-14",
//             startTime: "14:00",
//             endTime: "16:00",
//             mode: "OFFLINE",
//             locationOrLink: "Ruang Kelas 302 - Gedung Utama Lt. 3",
//             createdBy: "TEACHER",
//             totalStudents: 15,
//         },
//     ]);

//     const [savedId, setSavedId] = useState<string | null>(null);

//     // Handler Perubahan Data Sesi
//     const handleUpdateSession = (id: string, field: keyof ClassSession, value: any) => {
//         setSessions((prev) =>
//             prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
//         );
//     };

//     const handleSave = (id: string) => {
//         setSavedId(id);
//         setTimeout(() => setSavedId(null), 3000);
//     };

//     return (
//         <div className="p-8 max-w-6xl mx-auto space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//                         Atur Jadwal & Lokasi Mengajar
//                     </h1>
//                     <p className="text-sm text-slate-500 mt-1">
//                         Kelola metode kelas (Online/Offline), fleksibilitas jam, dan lokasi ruangan atau link pertemuan.
//                     </p>
//                 </div>
//             </div>

//             {/* Daftar Sesi Kelas */}
//             <div className="grid grid-cols-1 gap-6">
//                 {sessions.map((session) => (
//                     <div
//                         key={session.id}
//                         className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5"
//                     >
//                         {/* Header Sesi */}
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
//                             <div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                                         {session.program}
//                                     </span>
//                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${session.createdBy === "MANAGEMENT"
//                                         ? "bg-purple-50 text-purple-700 border border-purple-200"
//                                         : "bg-amber-50 text-amber-700 border border-amber-200"
//                                         }`}>
//                                         Dibuat Oleh: {session.createdBy}
//                                     </span>
//                                 </div>
//                                 <h2 className="text-lg font-bold text-slate-900 mt-1">{session.className}</h2>
//                             </div>

//                             <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
//                                 <Users className="w-4 h-4 text-slate-400" />
//                                 <span>{session.totalStudents} Siswa Terdaftar</span>
//                             </div>
//                         </div>

//                         {/* Grid Form Pengaturan Jadwal & Lokasi */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {/* Select Mode Kelas */}
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                                     Tipe / Mode Pembelajaran
//                                 </label>
//                                 <div className="grid grid-cols-2 gap-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => handleUpdateSession(session.id, "mode", "ONLINE")}
//                                         className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${session.mode === "ONLINE"
//                                             ? "bg-blue-600 text-white border-blue-600"
//                                             : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
//                                             }`}
//                                     >
//                                         <Globe className="w-3.5 h-3.5" /> Online
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleUpdateSession(session.id, "mode", "OFFLINE")}
//                                         className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${session.mode === "OFFLINE"
//                                             ? "bg-emerald-600 text-white border-emerald-600"
//                                             : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
//                                             }`}
//                                     >
//                                         <Building2 className="w-3.5 h-3.5" /> Offline
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Tanggal & Jam */}
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                                     Tanggal Sesi
//                                 </label>
//                                 <input
//                                     type="date"
//                                     value={session.date}
//                                     onChange={(e) => handleUpdateSession(session.id, "date", e.target.value)}
//                                     className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                                     Jam Pelaksanaan (WIB)
//                                 </label>
//                                 <div className="flex items-center gap-1">
//                                     <input
//                                         type="time"
//                                         value={session.startTime}
//                                         onChange={(e) => handleUpdateSession(session.id, "startTime", e.target.value)}
//                                         className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                     <span className="text-slate-400 text-xs font-bold">-</span>
//                                     <input
//                                         type="time"
//                                         value={session.endTime}
//                                         onChange={(e) => handleUpdateSession(session.id, "endTime", e.target.value)}
//                                         className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Input Dynamic Lokasi / Link Zoom */}
//                         <div className="space-y-1.5 pt-2">
//                             <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
//                                 {session.mode === "ONLINE" ? (
//                                     <>
//                                         <Video className="w-4 h-4 text-blue-600" /> Tautan / Link Zoom Meeting
//                                     </>
//                                 ) : (
//                                     <>
//                                         <MapPin className="w-4 h-4 text-emerald-600" /> Detail Lokasi Fisik / Ruangan Kelas
//                                     </>
//                                 )}
//                             </label>

//                             <div className="flex flex-col sm:flex-row gap-2">
//                                 <input
//                                     type="text"
//                                     value={session.locationOrLink}
//                                     onChange={(e) => handleUpdateSession(session.id, "locationOrLink", e.target.value)}
//                                     placeholder={
//                                         session.mode === "ONLINE"
//                                             ? "https://zoom.us/j/123456789..."
//                                             : "Contoh: Ruang kelas 201, Cabang Kemang / Alamat Lengkap..."
//                                     }
//                                     className="flex-1 text-xs font-medium border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() => handleSave(session.id)}
//                                     className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shrink-0 cursor-pointer"
//                                 >
//                                     <Save className="w-3.5 h-3.5" /> Update Sesi
//                                 </button>
//                             </div>

//                             {savedId === session.id && (
//                                 <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 pt-1">
//                                     <CheckCircle2 className="w-3.5 h-3.5" /> Perubahan jadwal & lokasi berhasil disimpan dan diteruskan ke portal siswa!
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import { Users, Calendar, ArrowRight, BookOpen, Clock } from "lucide-react";

interface ClassItem {
    id: string;
    name: string;
    code: string;
    schedule: string;
    room: string;
    totalStudents: number;
    lastAttendance: string;
}

export default function TeacherClassesPage() {
    const classes: ClassItem[] = [
        {
            id: "c1",
            name: "IELTS Intensive",
            code: "IELTS-B12",
            schedule: "Senin & Rabu, 09:00 - 10:30 WIB",
            room: "Ruang 201",
            totalStudents: 15,
            lastAttendance: "9 Sep 2026",
        },
        {
            id: "c2",
            name: "TOEFL iBT Preparation",
            code: "TOEFL-B05",
            schedule: "Selasa & Kamis, 13:00 - 15:00 WIB",
            room: "Ruang 104",
            totalStudents: 12,
            lastAttendance: "8 Sep 2026",
        },
        {
            id: "c3",
            name: "General English - Intermediate",
            code: "GE-INT-02",
            schedule: "Jumat, 14:00 - 16:00 WIB",
            room: "Lab Bahasa",
            totalStudents: 18,
            lastAttendance: "5 Sep 2026",
        },
    ];

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Kelas Mengajar</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pilih kelas untuk mengelola dan mencatat presensi harian siswa.
                </p>
            </div>

            {/* Grid Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-mono">
                                    {cls.code}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {cls.totalStudents} Siswa
                                </span>
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {cls.name}
                                </h2>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    {cls.schedule}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                                <p className="flex justify-between">
                                    <span>Lokasi Ruangan:</span>
                                    <span className="font-semibold text-slate-700">{cls.room}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Presensi Terakhir:</span>
                                    <span className="font-medium text-slate-600">{cls.lastAttendance}</span>
                                </p>
                            </div>
                        </div>

                        {/* Link ke Halaman Presensi Spesifik Kelas */}
                        <Link
                            href={`/teacher/classes/${cls.id}/attendance`}
                            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-2xs"
                        >
                            <span>Isi Presensi Kelas</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}