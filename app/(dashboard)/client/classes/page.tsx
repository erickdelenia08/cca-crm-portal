import React from "react";
import Link from "next/link";
import { getClientClasses, ClientCourseSummary } from "@/actions/client-portal.action";
import { BookOpen, User, ArrowRight, CalendarDays, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientClassesPage() {
    const res = await getClientClasses();
    const classes = res.data || [];

    if (!res.success) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    Gagal memuat kelas: {res.error}
                </div>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Kamu belum terdaftar di kelas manapun.</h2>
                    <p className="text-slate-500 max-w-sm mb-6">Silakan cek status My Services atau hubungi konsultan/admin jika kamu merasa seharusnya sudah masuk kelas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Classes</h1>
                <p className="text-slate-500 mt-2">Daftar kelas yang kamu ikuti, jadwal, dan progres belajarmu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((courseEnrollment) => (
                    <ClassCard key={courseEnrollment.id} courseEnrollment={courseEnrollment} />
                ))}
            </div>
        </div>
    );
}

function ClassCard({ courseEnrollment }: { courseEnrollment: ClientCourseSummary }) {
    const cls = courseEnrollment.courseClass;

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 flex-1 space-y-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 items-center mb-1">
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                {courseEnrollment.programEnrollment.programType.name}
                            </span>
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                                courseEnrollment.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                courseEnrollment.status === "COMPLETED" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                            )}>
                                {courseEnrollment.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">{cls.course.name}</h3>
                        <p className="text-sm font-semibold text-slate-600 mt-0.5">{cls.name}</p>
                    </div>
                </div>

                <div className="space-y-2.5 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Teacher: <strong>{cls.teacher?.user?.name || "Belum ditentukan"}</strong></span>
                    </div>

                    <div className="flex items-start gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {cls.schedulePatterns.length > 0 ? (
                                cls.schedulePatterns.map(sp => (
                                    <span key={sp.id} className="inline-block">
                                        <strong className="capitalize">{sp.dayOfWeek}</strong> {sp.startTime} - {sp.endTime}
                                    </span>
                                ))
                            ) : (
                                <span>Jadwal belum ditentukan</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Progress: <strong>{cls.sessions.length} / {cls.course.totalSessions} Sesi Selesai</strong></span>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 mt-auto">
                <Link
                    href={`/client/classes/${courseEnrollment.id}`}
                    className="flex items-center justify-between w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
                >
                    Lihat Detail Kelas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}