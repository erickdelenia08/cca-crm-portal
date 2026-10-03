"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Video,
    CheckCircle2,
    XCircle,
    AlertCircle,
    User,
    ExternalLink,
    Search,
    FileText
} from "lucide-react";
import { updateClientBookingStatus } from "@/actions/booking.action";

export interface SessionItem {
    id: string;
    studentName: string;
    studentEmail: string;
    program: string;
    topic: string;
    date: string;
    startTime: string;
    endTime: string;
    status: "UPCOMING" | "PENDING" | "COMPLETED" | "CANCELED" | "CONFIRMED";
    meetingUrl?: string | null;
    notes?: string | null;
}

interface SessionsClientProps {
    initialSessions: SessionItem[];
}

export function SessionsClient({ initialSessions }: SessionsClientProps) {
    const [activeTab, setActiveTab] = useState<"UPCOMING" | "PENDING" | "HISTORY">("UPCOMING");
    const [searchQuery, setSearchQuery] = useState("");
    const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpdateStatus = async (id: string, newStatus: "CONFIRMED" | "CANCELLED") => {
        setIsLoading(id);
        try {
            const res = await updateClientBookingStatus(id, newStatus as any);
            if (res?.success) {
                setSessions((prev) =>
                    prev.map((session) =>
                        session.id === id ? { ...session, status: newStatus === "CONFIRMED" ? "CONFIRMED" : "CANCELED" } : session
                    )
                );
            } else {
                alert(res?.error || "Gagal memperbarui status.");
            }
        } catch (error) {
            console.error("Error updating status", error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsLoading(null);
        }
    };

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.topic.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === "UPCOMING") return session.status === "CONFIRMED" || session.status === "UPCOMING";
        if (activeTab === "PENDING") return session.status === "PENDING";
        if (activeTab === "HISTORY")
            return session.status === "COMPLETED" || session.status === "CANCELED";

        return true;
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Jadwal Sesi & Booking
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola permintaan bimbingan siswa, konfirmasi jadwal, dan akses link meeting.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari siswa atau topik..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-3 gap-6 text-xs font-semibold overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("UPCOMING")}
                        className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "UPCOMING"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Sesi Mendatang
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">
                            {sessions.filter((s) => s.status === "CONFIRMED" || s.status === "UPCOMING").length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("PENDING")}
                        className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "PENDING"
                            ? "border-amber-600 text-amber-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <AlertCircle className="w-4 h-4" />
                        Permintaan Baru
                        {sessions.filter((s) => s.status === "PENDING").length > 0 && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {sessions.filter((s) => s.status === "PENDING").length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("HISTORY")}
                        className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "HISTORY"
                            ? "border-slate-800 text-slate-900"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Riwayat Sesi
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                            {session.program}
                                        </span>

                                        {(session.status === "UPCOMING" || session.status === "CONFIRMED") && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" /> Disetujui
                                            </span>
                                        )}
                                        {session.status === "PENDING" && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                                <AlertCircle className="w-3 h-3" /> Menunggu Konfirmasi
                                            </span>
                                        )}
                                        {session.status === "COMPLETED" && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                                Selesai
                                            </span>
                                        )}
                                        {session.status === "CANCELED" && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                                                Dibatalkan
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {session.studentName}
                                            <span className="text-xs font-normal text-slate-400">
                                                ({session.studentEmail})
                                            </span>
                                        </h3>
                                        <p className="text-xs font-medium text-slate-600 mt-1">
                                            Topik: <span className="text-slate-900">{session.topic || "Konsultasi Umum"}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {session.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {session.startTime} - {session.endTime} WIB
                                        </div>
                                    </div>

                                    {session.notes && (
                                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 mt-2">
                                            <strong>Catatan Siswa:</strong> {session.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                                    {session.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(session.id, "CONFIRMED")}
                                                disabled={isLoading === session.id}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Terima Booking
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(session.id, "CANCELLED")}
                                                disabled={isLoading === session.id}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 transition-colors disabled:opacity-50"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Tolak
                                            </button>
                                        </>
                                    )}

                                    {(session.status === "UPCOMING" || session.status === "CONFIRMED") && (
                                        <>
                                            {session.meetingUrl ? (
                                                <a
                                                    href={session.meetingUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm"
                                                >
                                                    <Video className="w-4 h-4" />
                                                    Masuk Virtual Room
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic px-2">
                                                    Link meeting belum diset
                                                </span>
                                            )}

                                            <Link
                                                href={`/consultant/sessions/${session.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Detail Sesi
                                            </Link>
                                        </>
                                    )}

                                    {(session.status === "COMPLETED" || session.status === "CANCELED") && (
                                        <Link
                                            href={`/consultant/sessions/${session.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Detail & Catatan
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-xs">Tidak ada sesi bimbingan pada kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
