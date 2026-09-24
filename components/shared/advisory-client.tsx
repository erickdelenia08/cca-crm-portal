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
    PlusCircle,
    User,
} from "lucide-react";
import { cancelAdvisorySession, getAdvisoryData } from "@/actions/advisory.action";

type AdvisoryData = NonNullable<
    Awaited<ReturnType<typeof getAdvisoryData>>["data"]
>;

interface AdvisoryClientProps {
    assignedConsultant: AdvisoryData["consultant"];
    sessions: AdvisoryData["sessions"];
    meetingNotes: AdvisoryData["meetingNotes"];
}

export default function AdvisoryClient({
    assignedConsultant,
    sessions,
    meetingNotes,
}: AdvisoryClientProps) {

    const [activeTab, setActiveTab] = useState<"SESSIONS" | "NOTES">("SESSIONS");
    const [isCancelling, setIsCancelling] = useState<string | null>(null);

    const handleCancelRequest = async (id: string) => {
        if (confirm("Apakah kamu yakin ingin membatalkan pengajuan bimbingan ini?")) {
            setIsCancelling(id);
            const res = await cancelAdvisorySession(id);
            if (!res.success) {
                alert(res.error || "Gagal membatalkan sesi.");
            }
            setIsCancelling(null);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(date));
    };

    const formatTime = (date: Date, duration: number) => {
        const start = new Date(date);
        const end = new Date(date.getTime() + duration * 60000);
        const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };

        return `${start.toLocaleTimeString("id-ID", timeOpts)} - ${end.toLocaleTimeString("id-ID", timeOpts)} WIB`;
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* HEADER: INFO KONSULTAN DEDICATED */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                {assignedConsultant ? (
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                            {assignedConsultant.image ? (
                                <img src={assignedConsultant.image} alt={assignedConsultant.name} className="w-full h-full object-cover" />
                            ) : (
                                assignedConsultant.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-slate-900">{assignedConsultant.name}</h1>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                                    Dedicated Consultant
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">{assignedConsultant.specialization || "General Consultant"}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Belum ada konsultan</p>
                            <p className="text-xs text-slate-500">Anda belum ditugaskan ke konsultan manapun.</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <Link
                        href="/student/booking"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Ajukan Jadwal Konsultasi</span>
                    </Link>
                </div>
            </div>

            {/* NAVIGASI TAB */}
            <div className="flex items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("SESSIONS")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "SESSIONS"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Sesi & Pengajuan ({sessions.filter((s) => s.status !== "CANCELLED").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("NOTES")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "NOTES"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Catatan Bimbingan ({meetingNotes.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: SESI & STATUS PENGAJUAN */}
            {activeTab === "SESSIONS" && (
                <div className="space-y-4">
                    {sessions.length === 0 ? (
                        <div className="p-5 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Belum ada sesi konsultasi.
                        </div>
                    ) : (
                        sessions
                            .filter((sess) => sess.status !== "CANCELLED")
                            .map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition-colors"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {session.sessionType === "CONSULTATION" ? "Konsultasi" :
                                                    session.sessionType === "DOCUMENT_REVIEW" ? "Review Dokumen" : session.sessionType}
                                            </h3>

                                            {/* STATUS BADGES */}
                                            {session.status === "CONFIRMED" && (
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Disetujui
                                                </span>
                                            )}
                                            {session.status === "PENDING" && (
                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Menunggu Konfirmasi
                                                </span>
                                            )}
                                            {session.status === "REJECTED" && (
                                                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" /> Ditolak
                                                </span>
                                            )}
                                            {session.status === "COMPLETED" && (
                                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    Selesai
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(session.scheduledAt)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" /> {formatTime(session.scheduledAt, session.durationMinutes)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-slate-400" /> {session.consultant?.name || "Konsultan"}
                                            </span>
                                        </div>

                                        {/* PESAN JIKA DITOLAK ATAU ADA NOTES */}
                                        {session.status === "REJECTED" && session.notes && (
                                            <div className="mt-2 p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold">Alasan Penolakan: </span>
                                                    {session.notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* AKSI BERDASARKAN STATUS */}
                                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                                        {session.status === "CONFIRMED" && session.meetingUrl && (
                                            <a
                                                href={session.meetingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                                            >
                                                <Video className="w-3.5 h-3.5" />
                                                <span>Masuk Zoom</span>
                                            </a>
                                        )}

                                        {session.status === "PENDING" && (
                                            <button
                                                type="button"
                                                disabled={isCancelling === session.id}
                                                onClick={() => handleCancelRequest(session.id)}
                                                className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isCancelling === session.id ? "Membatalkan..." : "Batalkan"}
                                            </button>
                                        )}

                                        {session.status === "REJECTED" && (
                                            <Link
                                                href="/student/booking"
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                                            >
                                                <span>Ajukan Ulang</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}

            {/* TAB 2: CATATAN BIMBINGAN */}
            {activeTab === "NOTES" && (
                <div className="space-y-3">
                    {meetingNotes.length === 0 ? (
                        <div className="p-5 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Belum ada catatan bimbingan.
                        </div>
                    ) : (
                        meetingNotes.map((note) => (
                            <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-bold text-slate-900">{note.title}</span>
                                    <span className="text-[11px] font-semibold text-slate-500">{formatDate(note.createdAt)}</span>
                                </div>
                                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{note.content}</div>
                                <p className="text-[11px] text-slate-400 pt-1">
                                    Konsultan: <span className="font-semibold text-slate-700">{note.consultant?.name || "Konsultan"}</span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
