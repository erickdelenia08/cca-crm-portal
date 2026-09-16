"use client";

import { useState } from "react";
import {
  Users,
  FileSearch,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  MessageSquare
} from "lucide-react";

// Types eksplisit tanpa `any`
type ProgramType = "STUDY_ABROAD" | "VISA_HOLIDAY" | "ENGLISH_COURSE" | "MANDARIN_COURSE";
type DocReviewStatus = "PENDING_REVIEW" | "NEEDS_REVISION" | "APPROVED";

interface StudentOverview {
  id: string;
  name: string;
  program: ProgramType;
  targetCountry?: string;
  pendingDocsCount: number;
  nextSessionDate?: string;
  progressPercent: number;
}

interface PendingDocumentReview {
  id: string;
  studentName: string;
  documentTitle: string;
  program: ProgramType;
  uploadedAt: string;
  fileUrl: string;
  status: DocReviewStatus;
}

export default function ConsultantDashboardPage() {
  const [activeTab, setActiveTab] = useState<"DOC_QUEUE" | "STUDENTS_LIST">("DOC_QUEUE");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock Summary Stats Konsultan
  const stats = {
    activeStudents: 18,
    pendingDocs: 5,
    upcomingSessionsToday: 3,
    completedThisMonth: 12,
  };

  // Mock Antrean Review Dokumen Siswa
  const [pendingDocs, setPendingDocs] = useState<PendingDocumentReview[]>([
    {
      id: "doc-rev-1",
      studentName: "John Doe",
      documentTitle: "Ijazah & Transkrip Nilai Terjemahan",
      program: "STUDY_ABROAD",
      uploadedAt: "08 Sep 2026, 14:30 WIB",
      fileUrl: "#",
      status: "PENDING_REVIEW",
    },
    {
      id: "doc-rev-2",
      studentName: "Siti Rahma",
      documentTitle: "Bukti Rekening Koran (Proof of Funds - WHV)",
      program: "VISA_HOLIDAY",
      uploadedAt: "09 Sep 2026, 09:15 WIB",
      fileUrl: "#",
      status: "PENDING_REVIEW",
    },
    {
      id: "doc-rev-3",
      studentName: "Budi Pratama",
      documentTitle: "Draft Personal Statement v2",
      program: "STUDY_ABROAD",
      uploadedAt: "09 Sep 2026, 11:00 WIB",
      fileUrl: "#",
      status: "PENDING_REVIEW",
    },
  ]);

  // Mock Daftar Siswa yang Didampingi
  const assignedStudents: StudentOverview[] = [
    {
      id: "std-1",
      name: "John Doe",
      program: "STUDY_ABROAD",
      targetCountry: "Australia",
      pendingDocsCount: 1,
      nextSessionDate: "10 Sep 2026, 15:30 WIB",
      progressPercent: 65,
    },
    {
      id: "std-2",
      name: "Siti Rahma",
      program: "VISA_HOLIDAY",
      targetCountry: "Australia (WHV)",
      pendingDocsCount: 1,
      nextSessionDate: "11 Sep 2026, 10:00 WIB",
      progressPercent: 40,
    },
    {
      id: "std-3",
      name: "Michael Chen",
      program: "MANDARIN_COURSE",
      pendingDocsCount: 0,
      nextSessionDate: "12 Sep 2026, 13:00 WIB",
      progressPercent: 85,
    },
  ];

  const handleApproveDocument = (id: string) => {
    setPendingDocs((prev) => prev.filter((doc) => doc.id !== id));
    alert("Dokumen berhasil disetujui (Approved).");
  };

  const handleRequestRevision = (id: string) => {
    const note = prompt("Masukkan catatan revisi untuk siswa:");
    if (!note) return;
    setPendingDocs((prev) => prev.filter((doc) => doc.id !== id));
    alert("Permintaan revisi berhasil dikirim ke siswa.");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800">
      {/* Header Portal Konsultan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard Konsultan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pendampingan program siswa, verifikasi berkas, dan sesi bimbingan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/consultant/schedules"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Atur Availability Jam</span>
          </a>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Siswa Aktif</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.activeStudents}</p>
          <p className="text-[11px] text-slate-400">Di bawah pendampingan Anda</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Dokumen Butuh Review</span>
            <FileSearch className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingDocs.length}</p>
          <p className="text-[11px] text-amber-600 font-medium">Perlu tindakan verifikasi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bimbingan Hari Ini</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.upcomingSessionsToday}</p>
          <p className="text-[11px] text-slate-400">Sesi terkonfirmasi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Selesai Bulan Ini</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.completedThisMonth}</p>
          <p className="text-[11px] text-slate-400">Aplikasi/Visa berhasil submit</p>
        </div>
      </div>

      {/* Segmented Control Navigasi Workarea */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab("DOC_QUEUE")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "DOC_QUEUE"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Antrean Review Dokumen ({pendingDocs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("STUDENTS_LIST")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "STUDENTS_LIST"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Daftar Siswa Pendampingan ({assignedStudents.length})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa atau dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* WORKAREA 1: ANTREAN REVIEW DOKUMEN */}
      {activeTab === "DOC_QUEUE" && (
        <div className="space-y-3">
          {pendingDocs.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-slate-900">Semua Dokumen Telah Diverifikasi</p>
              <p className="text-[11px] text-slate-500">Tidak ada antrean dokumen siswa yang menunggu review saat ini.</p>
            </div>
          ) : (
            pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      {doc.program.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{doc.studentName}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">{doc.documentTitle}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Diunggah: {doc.uploadedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                  >
                    <span>Lihat Berkas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRequestRevision(doc.id)}
                    className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                  >
                    Minta Revisi
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveDocument(doc.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Setujui (Approve)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WORKAREA 2: DAFTAR SISWA PENDAMPINGAN */}
      {activeTab === "STUDENTS_LIST" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {assignedStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">{student.name}</p>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {student.program.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Target: <span className="font-medium text-slate-700">{student.targetCountry ?? "Sesuai Program"}</span>
                    {student.nextSessionDate && ` • Bimbingan Berikutnya: ${student.nextSessionDate}`}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Progress Indicator */}
                  <div className="text-right hidden md:block">
                    <span className="text-[11px] font-semibold text-slate-500">Progres Berkas</span>
                    <p className="text-xs font-bold text-slate-900">{student.progressPercent}%</p>
                  </div>

                  <a
                    href={`/consultant/students/${student.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white"
                  >
                    <span>Detail Siswa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}