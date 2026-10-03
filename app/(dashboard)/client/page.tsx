import React from "react";
import Link from "next/link";
import { getClientDashboard, getClientSchedule } from "@/actions/client-portal.action";
import { getClientProfile } from "@/actions/booking.action";
import {
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  UserCheck,
  BookOpen,
  Briefcase,
  Sparkles,
  CalendarClock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientDashboardPage() {
  const profileRes = await getClientProfile();
  const res = await getClientDashboard();
  const scheduleRes = await getClientSchedule();
  
  if (!res.success) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              Failed to load dashboard: {res.error}
          </div>
      </div>
    );
  }

  const enrollments = res.data || [];
  const clientProfile = profileRes;
  const isNewStudent = enrollments.length === 0;
  
  const schedule = scheduleRes.success ? scheduleRes.data : [];
  const upcomingSchedule = schedule.filter(s => s.status === "PENDING" || s.status === "CONFIRMED").slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-800 font-sans">

      {/* 1. Header Minimalis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Halo, {clientProfile.fullName} 👋
            </h1>
            {clientProfile.clientNumber && (
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                {clientProfile.clientNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan layanan dan aktivitas kamu saat ini.
          </p>
        </div>
      </div>

      {/* Upcoming Activity */}
      {upcomingSchedule.length > 0 && (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CalendarClock className="w-5 h-5 text-indigo-600" />
                      Upcoming Activity
                  </h2>
                  <Link
                      href="/client/bookings"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                  >
                      Lihat Semua
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSchedule.map(item => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                          <div className={cn("p-3 rounded-lg", item.type === "COURSE_SESSION" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700")}>
                              {item.type === "COURSE_SESSION" ? <BookOpen className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 capitalize text-sm">{item.title.replace(/_/g, ' ').toLowerCase()}</h3>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.startTime).toLocaleDateString('id-ID')}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 2. State: Siswa Baru (Belum ada Program) */}
      {isNewStudent && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-indigo-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Belum ada layanan aktif
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Kamu belum memiliki enrollment aktif di layanan apapun. Silakan hubungi admin untuk pendaftaran layanan.
            </p>
          </div>
        </div>
      )}

      {!isNewStudent && (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    My Services Overview
                </h2>
                <Link
                    href="/client/services"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                >
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.slice(0, 6).map((enrollment) => {
                    const isService = enrollment.deliveryType === "SERVICE";
                    return (
                        <div key={enrollment.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                                        {enrollment.programName}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                        {enrollment.programTypeName}
                                    </h3>
                                </div>
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded",
                                    isService ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {enrollment.deliveryType}
                                </span>
                            </div>

                            <div className="space-y-3 mb-5 flex-1">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Status: <span className="font-semibold text-slate-900">{enrollment.status}</span></span>
                                </div>

                                {isService ? (
                                    <>
                                        {enrollment.consultant && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <UserCheck className="w-4 h-4 text-slate-400" />
                                                <span>Consultant: <span className="font-semibold text-slate-900">{enrollment.consultant.name}</span></span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FileCheck className="w-4 h-4 text-slate-400" />
                                            <span>Docs: <span className="font-semibold text-slate-900">{enrollment.documentProgress.completed} / {enrollment.documentProgress.total}</span></span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {enrollment.courseClass && (
                                            <>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <BookOpen className="w-4 h-4 text-slate-400" />
                                                    <span>Class: <span className="font-semibold text-slate-900">{enrollment.courseClass.name}</span></span>
                                                </div>
                                                {enrollment.courseClass.teacher && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <UserCheck className="w-4 h-4 text-slate-400" />
                                                        <span>Teacher: <span className="font-semibold text-slate-900">{enrollment.courseClass.teacher.user?.name}</span></span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            <Link 
                                href={`/client/services/${enrollment.id}`}
                                className="w-full mt-auto text-center py-2 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-semibold text-sm rounded-lg border border-slate-200 transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
}