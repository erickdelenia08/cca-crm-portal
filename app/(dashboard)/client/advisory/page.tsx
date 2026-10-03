import React from "react";
import Link from "next/link";
import { getClientAdvisorySessions, ClientAdvisorySession } from "@/actions/client-portal.action";
import { CalendarCheck, Clock, Video, User, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientAdvisoryPage() {
    const res = await getClientAdvisorySessions();
    const sessions = res.data || [];

    if (!res.success) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    Gagal memuat sesi advisory: {res.error}
                </div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CalendarCheck className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Belum ada sesi advisory.</h2>
                    <p className="text-slate-500 max-w-sm mb-6">Kamu belum menjadwalkan konsultasi atau layanan advisory apa pun.</p>
                    <Link href="/client/bookings/new" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm">
                        Jadwalkan Konsultasi
                    </Link>
                </div>
            </div>
        );
    }

    const upcoming = sessions.filter(s => s.status === "PENDING" || s.status === "CONFIRMED");
    const past = sessions.filter(s => s.status === "COMPLETED" || s.status === "CANCELLED");

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advisory Sessions</h1>
                    <p className="text-slate-500 mt-2">Jadwal konsultasi dan riwayat advisory untuk layananmu.</p>
                </div>
                <Link href="/client/bookings/new" className="hidden sm:inline-flex px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    Jadwal Baru
                </Link>
            </div>

            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Upcoming Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcoming.map(session => (
                            <AdvisoryCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Past Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {past.map(session => (
                            <AdvisoryCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AdvisoryCard({ session }: { session: ClientAdvisorySession }) {
    const isUpcoming = session.status === "PENDING" || session.status === "CONFIRMED";
    
    return (
        <div className={cn(
            "flex flex-col bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow",
            session.status === "COMPLETED" ? "border-emerald-200 opacity-80 hover:opacity-100" :
            session.status === "CANCELLED" ? "border-red-200 opacity-80 hover:opacity-100" : "border-slate-200"
        )}>
            <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 block w-fit">
                            {session.serviceName}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 capitalize">{session.sessionType.replace(/_/g, ' ').toLowerCase()}</h3>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-md",
                        session.status === "CONFIRMED" ? "bg-indigo-100 text-indigo-700" :
                        session.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        session.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                        {session.status}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        {new Date(session.scheduledAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(session.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ({session.durationMinutes} Menit)
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Consultant: <strong>{session.consultant.name}</strong>
                    </div>
                </div>

                {session.meetingUrl && isUpcoming && (
                    <div className="pt-2">
                        <a 
                            href={session.meetingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                            <Video className="w-4 h-4" />
                            Join Meeting
                        </a>
                    </div>
                )}
            </div>

            {session.enrollmentId && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 mt-auto">
                    <Link
                        href={`/client/services/${session.enrollmentId}`}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Lihat Layanan Terkait
                    </Link>
                </div>
            )}
        </div>
    );
}