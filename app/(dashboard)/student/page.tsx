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
  UserCheck
} from "lucide-react";

export default function ClientDashboardPage() {
  const clientProfile = {
    name: "Ahmad Rizky",
    clientCode: "CCA-CLI-26-000102",
    hasActiveClasses: true,
    hasActiveAdvisory: true,
  };

  const advisorySteps = [
    { name: "Konsultasi Awal & Jurusan", status: "COMPLETED" },
    { name: "Persiapan Dokumen (Ijazah/Paspor)", status: "COMPLETED" },
    { name: "Pendaftaran Kampus / LoA", status: "IN_PROGRESS" },
    { name: "Pengajuan Visa Pelajar", status: "PENDING" },
  ];

  const upcomingClass = {
    title: "IELTS Intensive - Writing Task 2",
    time: "Hari Ini, 15:30 WIB",
    tutor: "Ms. Sarah Jenkins",
    link: "https://zoom.us/j/mocklink",
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto text-slate-800">
      {/* Header Clean & Simple (No Fancy AI Gradient) */}
      <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Halo, {clientProfile.name}</h1>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {clientProfile.clientCode}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pantau progres pendaftaran luar negeri dan jadwal kelas aktif Anda.
          </p>
        </div>

        {clientProfile.hasActiveAdvisory && (
          <Link
            href="/client/booking"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Jadwalkan Konsultasi</span>
          </Link>
        )}
      </div>

      {/* SEKSI 1: UNTUK KLIEN STUDY ABROAD / ADVISORY */}
      {clientProfile.hasActiveAdvisory && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Progress Pendaftaran Studi Luar Negeri
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Master Degree - Monash University, Australia (Feb 2027 Intake)
              </p>
            </div>
            <Link
              href="/client/advisory"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              Detail Berkas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {advisorySteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2.5 ${step.status === "COMPLETED"
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                    : step.status === "IN_PROGRESS"
                      ? "bg-amber-50/50 border-amber-200 text-amber-950"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
              >
                {step.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : step.status === "IN_PROGRESS" ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{step.name}</p>
                  <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5 block">
                    {step.status === "COMPLETED"
                      ? "Selesai"
                      : step.status === "IN_PROGRESS"
                        ? "Proses Verifikasi"
                        : "Belum Dimulai"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEKSI 2: UNTUK KLIEN KELAS / TEST PREP */}
      {clientProfile.hasActiveClasses && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sesi Mengajar Berikutnya */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Jadwal Kelas Mendatang
              </h2>
              <Link
                href="/client/classes"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Semua Kelas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                  {upcomingClass.time}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">
                  {upcomingClass.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Pengajar: <span className="font-medium text-slate-700">{upcomingClass.tutor}</span>
                </p>
              </div>

              <a
                href={upcomingClass.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Masuk Zoom</span>
              </a>
            </div>
          </div>

          {/* Ringkasan Skor / Target Tryout */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Target Skor IELTS
            </h2>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Simulasi Terakhir
              </p>
              <div className="text-3xl font-bold text-slate-900">6.5</div>
              <p className="text-xs text-slate-600">
                Target Kampus: <span className="font-bold text-slate-900">7.0</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}