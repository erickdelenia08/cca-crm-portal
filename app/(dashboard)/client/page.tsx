"use client";

import Link from "next/link";
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
  Sparkles,
} from "lucide-react";

export default function ClientDashboardPage() {
  // Simulasi data dari DB / API
  const clientProfile = {
    name: "Ahmad Rizky",
    clientCode: "CCA-CLI-26-000102",
    hasActiveClasses: true,
    hasActiveAdvisory: true,
  };

  const advisorySteps = [
    { name: "Konsultasi & Jurusan", status: "COMPLETED" },
    { name: "Berkas (Ijazah/Paspor)", status: "COMPLETED" },
    { name: "Pendaftaran Kampus", status: "IN_PROGRESS" },
    { name: "Pengajuan Visa", status: "PENDING" },
  ];

  const upcomingClass = {
    title: "IELTS Intensive - Writing Task 2",
    time: "Hari Ini, 15:30 WIB",
    tutor: "Ms. Sarah Jenkins",
    link: "https://zoom.us/j/mocklink",
  };

  const isNewStudent = !clientProfile.hasActiveClasses && !clientProfile.hasActiveAdvisory;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-800 font-sans">

      {/* 1. Header Minimalis (Tanpa Banner Gelap) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Halo, {clientProfile.name} 👋
            </h1>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {clientProfile.clientCode}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan progres studi luar negeri dan aktivitas kelas kamu.
          </p>
        </div>

        {clientProfile.hasActiveAdvisory && (
          <Link
            href="/student/booking"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-lg text-xs transition-all shadow-sm shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Jadwalkan Konsultasi</span>
          </Link>
        )}
      </div>

      {/* 2. State: Siswa Baru (Belum ada Program) */}
      {isNewStudent && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-blue-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Belum ada program aktif
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Kamu belum mendaftar kelas persiapan tes atau program konsultasi. Yuk, pilih program yang sesuai targetmu!
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
          >
            Eksplor Program
          </Link>
        </div>
      )}

      {/* 3. Seksi Advisory / Study Abroad */}
      {clientProfile.hasActiveAdvisory && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Progress Pendaftaran Kampus
              </h2>
              <p className="text-xs text-slate-500">
                Master Degree • Monash University, Australia
              </p>
            </div>
            <Link
              href="/student/advisory"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Lihat Detail <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {advisorySteps.map((step, idx) => {
              const isDone = step.status === "COMPLETED";
              const isInProgress = step.status === "IN_PROGRESS";

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${isDone
                    ? "bg-white border-emerald-200 shadow-sm"
                    : isInProgress
                      ? "bg-amber-50/40 border-amber-300 shadow-sm"
                      : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                      Step 0{idx + 1}
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isInProgress && <Clock className="w-4 h-4 text-amber-600" />}
                    {!isDone && !isInProgress && <AlertCircle className="w-4 h-4 text-slate-300" />}
                  </div>
                  <p className="text-xs font-bold text-slate-800">{step.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">
                    {isDone ? "Selesai" : isInProgress ? "Sedang Proses" : "Belum Dimulai"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Seksi Class & Test Prep */}
      {clientProfile.hasActiveClasses && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">

          {/* Jadwal Kelas */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Kelas Selanjutnya
              </h2>
              <Link
                href="/student/classes"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Jadwal Lengkap <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                  {upcomingClass.time}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                  {upcomingClass.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Tutor: <span className="font-medium text-slate-700">{upcomingClass.tutor}</span>
                </p>
              </div>

              <a
                href={upcomingClass.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors shadow-sm shrink-0"
              >
                <Video className="w-4 h-4" />
                <span>Join Zoom</span>
              </a>
            </div>
          </div>

          {/* Target Skor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Target & Skor IELTS
            </h2>

            <div className="py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Simulasi Terakhir
              </span>
              <div className="text-3xl font-extrabold text-slate-900">6.5</div>
              <p className="text-xs text-slate-500">
                Target Minimum: <span className="font-bold text-slate-800">7.0</span>
              </p>
            </div>
          </div>

        </section>
      )}

    </div>
  );
}