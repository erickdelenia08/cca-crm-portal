"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Users,
    MapPin,
    PlusCircle,
    History,
    Settings,
    ChevronRight,
    CheckCircle2,
    CalendarDays // Ikon untuk Ubah Jadwal
} from "lucide-react";
import RescheduleModal from "./_component/RescheduleModal";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ClassDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const classId = resolvedParams.id;

    // State untuk mengontrol Modal Reschedule
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<{
        id: string;
        number: number;
        topic: string;
    } | null>(null);

    // Mock data kelas
    const classData = {
        id: classId,
        name: "IELTS Intensive",
        code: "IELTS-B12",
        schedule: "Senin & Rabu, 09:00 - 10:30 WIB",
        room: "Ruang 201",
        totalStudents: 15,
    };

    // Mock daftar sesi pertemuan
    const sessions = [
        {
            id: "sess-1",
            number: 1,
            date: "9 Sep 2026",
            time: "09:00 - 10:30 WIB",
            topic: "Speaking Part 2 - Monologue Strategy",
            status: "COMPLETED",
            present: 14,
            total: 15
        },
        {
            id: "sess-2",
            number: 2,
            date: "14 Sep 2026",
            time: "09:00 - 10:30 WIB",
            topic: "Writing Task 2 - Essay Structure",
            status: "COMPLETED",
            present: 15,
            total: 15
        },
        {
            id: "sess-3",
            number: 3,
            date: "23 Sep 2026",
            time: "09:00 - 10:30 WIB",
            topic: "Listening Section 3 - Multiple Choice",
            status: "UPCOMING",
            present: 0,
            total: 15
        },
    ];

    // Handler untuk membuka modal reschedule pada sesi tertentu
    const handleOpenReschedule = (session: { id: string; number: number; topic: string }) => {
        setSelectedSession(session);
        setIsRescheduleOpen(true);
    };

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/teacher/classes"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Kelas
                </Link>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                    {classData.code}
                </span>
            </div>

            {/* Header Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {classData.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {classData.schedule}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {classData.room}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {classData.totalStudents} Siswa
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href={`/teacher/classes/${classId}/settings`}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title="Pengaturan Jadwal Rutin"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                    <Link
                        href={`/teacher/classes/${classId}/history`}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                    >
                        <History className="w-4 h-4" />
                        <span>Rekap Kehadiran</span>
                    </Link>
                    <Link
                        href={`/teacher/classes/${classId}/session`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Isi Presensi Sesi Ini</span>
                    </Link>
                </div>
            </div>

            {/* List Sesi Pertemuan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Agenda Pertemuan Sesi</h2>
                    <Link
                        href={`/teacher/classes/${classId}/history`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        Lihat Rekap
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="divide-y divide-slate-100">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900">
                                        Sesi {session.number}: {session.topic}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {session.date} ({session.time})
                                    </span>
                                </div>

                                {session.status === "COMPLETED" ? (
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        Kehadiran: {session.present} dari {session.total} siswa
                                    </p>
                                ) : (
                                    <p className="text-xs text-amber-600 font-medium">
                                        Belum dilaksanakan
                                    </p>
                                )}
                            </div>

                            {/* Action Per Sesi */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                                {/* Tombol Ubah Jadwal Khusus 1 Hari Ini */}
                                <button
                                    onClick={() =>
                                        handleOpenReschedule({
                                            id: session.id,
                                            number: session.number,
                                            topic: session.topic,
                                        })
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                    title="Geser/Ubah jadwal pertemuan ini saja"
                                >
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    <span>Ubah Jadwal</span>
                                </button>

                                <Link
                                    href={`/teacher/classes/${classId}/session?sessionId=${session.id}`}
                                    className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {session.status === "COMPLETED" ? "Edit Presensi" : "Presensi"}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PEMANGGILAN MODAL RESCHEDULE */}
            {selectedSession && (
                <RescheduleModal
                    isOpen={isRescheduleOpen}
                    onClose={() => setIsRescheduleOpen(false)}
                    currentClassId={classId}
                    sessionId={selectedSession.id}
                    sessionNumber={selectedSession.number}
                />
            )}
        </div>
    );
}