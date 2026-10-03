import React from "react";
import Link from "next/link";
import { getClientCourseEnrollment, ClientCourseEnrollmentDetail } from "@/actions/client-portal.action";
import { ArrowLeft, User, CalendarDays, Clock, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientCourseDetailPage({
    params
}: {
    params: Promise<{ courseEnrollmentId: string }>;
}) {
    const { courseEnrollmentId } = await params;
    const res = await getClientCourseEnrollment(courseEnrollmentId);

    if (!res.success || !res.data) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6 text-center">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {res.error || "Kelas tidak ditemukan."}
                </div>
                <Link href="/client/classes" className="text-indigo-600 font-semibold underline">
                    Kembali ke Daftar Kelas
                </Link>
            </div>
        );
    }

    const enrollment = res.data;
    const cls = enrollment.courseClass;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Link href="/client/classes" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Kembali ke Daftar Kelas
            </Link>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                                {enrollment.programEnrollment.programType.name}
                            </span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border",
                                enrollment.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                enrollment.status === "COMPLETED" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-50 text-slate-700 border-slate-200"
                            )}>
                                {enrollment.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{cls.course.name}</h1>
                        <p className="text-slate-500 mt-1 font-medium">{cls.name}</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Pengajar (Teacher)
                            </h3>
                            {cls.teacher ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                                        {cls.teacher.user.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{cls.teacher.user.name}</p>
                                        {cls.teacher.user.email && <p className="text-sm text-slate-500">{cls.teacher.user.email}</p>}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Belum ada pengajar yang ditugaskan.</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-indigo-600" />
                                Jadwal Rutin
                            </h3>
                            <div className="space-y-2 text-sm text-slate-700">
                                {cls.schedulePatterns.length > 0 ? (
                                    cls.schedulePatterns.map((sp: any) => (
                                        <div key={sp.id} className="flex gap-2">
                                            <span className="capitalize w-16 font-semibold">{sp.dayOfWeek}</span>
                                            <span>{sp.startTime} - {sp.endTime}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Jadwal rutin belum diatur.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Sesi Kelas
                            </h3>
                            <div className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                {cls.sessions.length} / {cls.course.totalSessions} Sesi Berjalan
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                            {cls.sessions.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {cls.sessions.map((session: any, i: number) => {
                                        const attendance = session.attendances?.[0];
                                        const isPast = new Date(session.startTime).getTime() < Date.now();
                                        const statusLabel = isPast ? "COMPLETED" : "SCHEDULED";
                                        return (
                                            <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-100 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 w-8 text-center font-bold text-slate-400">
                                                        {(i + 1).toString().padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">
                                                            {new Date(session.startTime).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(session.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-md",
                                                        !isPast ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                                    )}>
                                                        {statusLabel}
                                                    </span>
                                                    {attendance ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    Belum ada sesi yang dijadwalkan untuk kelas ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
