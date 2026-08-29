"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  CalendarCheck2
} from "lucide-react";

export default function ConsultantDashboardPage() {
  // Mock Data Read-Only Dashboard
  const stats = {
    activeStudents: 24,
    weeklySessions: 12,
    pendingBookings: 3,
    actionRequiredDocs: 5,
  };

  const todaySessions = [
    {
      id: "1",
      time: "09:00 - 10:00 WIB",
      studentName: "Budi Santoso",
      sessionType: "Consultation • Review Motivational Letter",
      status: "Upcoming",
    },
    {
      id: "2",
      time: "13:30 - 14:30 WIB",
      studentName: "Siti Rahma",
      sessionType: "Mock Interview • Persiapan Beasiswa Chevening",
      status: "Urgent",
    },
    {
      id: "3",
      time: "15:45 - 16:45 WIB",
      studentName: "Andi Pratama",
      sessionType: "Initial Strategy • Pemilihan Universitas",
      status: "Upcoming",
    },
  ];

  const todoItems = [
    {
      id: "t1",
      type: "DOCUMENT",
      title: "Review Draft Essay 2",
      subtitle: "Dari siswa: Budi Santoso",
      href: "/consultant/documents",
    },
    {
      id: "t2",
      type: "BOOKING",
      title: "Konfirmasi Permintaan Booking",
      subtitle: "Jadwal diajukan oleh: Dewi Lestari",
      href: "/consultant/sessions",
    },
    {
      id: "t3",
      type: "DOCUMENT",
      title: "Evaluasi Transkrip & Paspor",
      subtitle: "Dari siswa: Rian Hidayat",
      href: "/consultant/documents",
    },
    {
      id: "t4",
      type: "BOOKING",
      title: "Permintaan Reschedule Sesi",
      subtitle: "Diajukan oleh: Siti Rahma",
      href: "/consultant/sessions",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Ringkasan Kinerja & Pekerjaan Hari Ini
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Selamat datang kembali! Berikut adalah ikhtisar jadwal dan tugas binaan siswa Anda.
        </p>
      </div>

      {/* Statistik Siswa & Pekerjaan (Kartu Angka) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Siswa Aktif */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Siswa Aktif Binaan
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.activeStudents}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Sesi Minggu Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sesi Minggu Ini
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.weeklySessions}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Booking Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Booking Pending
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.pendingBookings}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Dokumen Perlu Action */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dokumen Perlu Tindak Lanjut
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.actionRequiredDocs}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions (Shortcut) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-xl">
        <h2 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">
          ⚡ Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/consultant/schedule"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-2xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Set Availability (Atur Jadwal)</span>
          </Link>
          <Link
            href="/consultant/sessions"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-2xs"
          >
            <CalendarCheck2 className="w-4 h-4 text-amber-600" />
            <span>Bookings Pending ({stats.pendingBookings})</span>
          </Link>
        </div>
      </div>

      {/* Content Layout: Left (Agenda) & Right (To-Do List) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Agenda Hari Ini / Terdekat */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Agenda & Sesi Terdekat
              </h2>
              <Link
                href="/consultant/sessions"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Lihat Semua Jadwal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg bg-slate-50 border-l-4 border-blue-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {session.time}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {session.studentName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {session.sessionType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): To-Do List */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                To-Do List & Pengingat
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {todoItems.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    {item.type === "DOCUMENT" ? (
                      <FileText className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <Link
                        href={item.href}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.subtitle}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {item.type === "DOCUMENT" ? "Dokumen Siswa" : "Booking Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}