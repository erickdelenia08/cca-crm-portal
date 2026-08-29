"use client";

import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  FileCheck,
  LogIn,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export default function RootLandingPage() {
  // Mock Role Dashboard List untuk navigasi cepat
  const dashboards = [
    {
      title: "Super Admin / Management",
      path: "/management",
      role: "Full Access Oversight",
      icon: ShieldCheck,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Konsultan",
      path: "/consultant",
      role: "Konsultasi & Sesi Siswa",
      icon: UserCheck,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Tim Pengolah Dokumen",
      path: "/processor",
      role: "Pemrosesan Berkas Harian",
      icon: FileCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      {/* Navbar Sederhana */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">
            Consultan Central Asia<span className="text-blue-600">.</span>
          </span>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <LogIn className="w-4 h-4 text-slate-500" /> Masuk / Login
        </Link>
      </header>

      {/* Hero & Navigasi Portal Role */}
      <main className="max-w-4xl w-full mx-auto my-auto py-12 space-y-8 text-center">
        <div className="space-y-3 max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-full">
            Gateway Navigasi Sistem
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang di Portal Edukasi
          </h1>
          <p className="text-sm text-slate-500">
            Silakan login terlebih dahulu atau pilih ruang kerja (dashboard) sesuai dengan peran akun Anda untuk melanjutkan.
          </p>
        </div>

        {/* Card Grid Pilihan Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
          {dashboards.map((dash) => {
            const IconComponent = dash.icon;
            return (
              <div
                key={dash.path}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dash.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{dash.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{dash.role}</p>
                  </div>
                </div>

                <Link
                  href={dash.path}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs ${dash.buttonColor}`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Masuk Dashboard
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Opsi Alternatif Login Saja */}
        <div className="pt-6 border-t border-slate-200 max-w-md mx-auto">
          <p className="text-xs text-slate-500 mb-3">
            Belum terautentikasi? Masuk dengan kredensial Anda:
          </p>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Halaman Login Pengguna <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 max-w-6xl w-full mx-auto">
        &copy; {new Date().getFullYear()} EduPortal System. All rights reserved.
      </footer>
    </div>
  );
}