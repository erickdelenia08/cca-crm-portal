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
import { AttendanceCard } from "@/components/attendance/attendance-card";

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
    <div className="max-w-7xl mx-auto p-8 md:p-12 space-y-10 font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Header Portal Konsultan */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#e2e8f0]">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Consultant Workspace</h1>
          <p className="text-[15px] text-[#475569] font-normal">
            Manage your student sessions, verify documents, and track progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/consultant/schedules"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold text-sm rounded-full transition-all shadow-sm hover:shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Availability</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Attendance Widget */}
        <div className="lg:col-span-1">
          <AttendanceCard />
        </div>

        {/* Metric Cards Summary */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0284c7]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0f172a] tracking-tight">{stats.activeStudents}</p>
            <p className="text-sm font-semibold text-[#475569] mt-1">Active Students</p>
            <p className="text-[12px] text-[#64748b] mt-1">Under your guidance</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#fef3c7] flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-[#d97706]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0f172a] tracking-tight">{pendingDocs.length}</p>
            <p className="text-sm font-semibold text-[#475569] mt-1">Docs for Review</p>
            <p className="text-[12px] text-[#d97706] font-medium mt-1">Requires action</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#d1fae5] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#059669]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0f172a] tracking-tight">{stats.upcomingSessionsToday}</p>
            <p className="text-sm font-semibold text-[#475569] mt-1">Sessions Today</p>
            <p className="text-[12px] text-[#64748b] mt-1">Confirmed</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#4f46e5]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0f172a] tracking-tight">{stats.completedThisMonth}</p>
            <p className="text-sm font-semibold text-[#475569] mt-1">Completed</p>
            <p className="text-[12px] text-[#64748b] mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* Segmented Control Navigasi Workarea */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="inline-flex p-1.5 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
          <button
            type="button"
            onClick={() => setActiveTab("DOC_QUEUE")}
            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === "DOC_QUEUE"
                ? "bg-white text-[#0f172a] shadow-sm"
                : "text-[#64748b] hover:text-[#0f172a]"
              }`}
          >
            Document Queue ({pendingDocs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("STUDENTS_LIST")}
            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === "STUDENTS_LIST"
                ? "bg-white text-[#0f172a] shadow-sm"
                : "text-[#64748b] hover:text-[#0f172a]"
              }`}
          >
            Assigned Students ({assignedStudents.length})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-4 top-3 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search students or docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* WORKAREA 1: ANTREAN REVIEW DOKUMEN */}
      {activeTab === "DOC_QUEUE" && (
        <div className="space-y-4">
          {pendingDocs.length === 0 ? (
            <div className="bg-white py-16 px-6 rounded-2xl border border-[#e2e8f0] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#10b981] mx-auto" />
              <p className="text-lg font-bold text-[#0f172a]">All Caught Up!</p>
              <p className="text-[14px] text-[#64748b]">There are no documents waiting in your queue.</p>
            </div>
          ) : (
            pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-2xl border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-bold text-[#0369a1] bg-[#e0f2fe] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {doc.program.replace("_", " ")}
                    </span>
                    <span className="text-[15px] font-bold text-[#0f172a]">{doc.studentName}</span>
                  </div>

                  <p className="text-[16px] font-semibold text-[#1e293b]">{doc.documentTitle}</p>

                  <div className="flex items-center gap-2 text-[13px] text-[#64748b] font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Uploaded: {doc.uploadedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] text-[13px] font-bold rounded-lg inline-flex items-center gap-2 transition-colors"
                  >
                    <span>View File</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRequestRevision(doc.id)}
                    className="px-4 py-2 border border-[#fecdd3] text-[#be123c] hover:bg-[#fff1f2] text-[13px] font-bold rounded-lg transition-colors"
                  >
                    Request Revision
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveDocument(doc.id)}
                    className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WORKAREA 2: DAFTAR SISWA PENDAMPINGAN */}
      {activeTab === "STUDENTS_LIST" && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <div className="divide-y divide-[#f1f5f9]">
            {assignedStudents.map((student) => (
              <div
                key={student.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#f8fafc] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="text-[16px] font-bold text-[#0f172a]">{student.name}</p>
                    <span className="text-[10px] font-bold text-[#475569] bg-[#f1f5f9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {student.program.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-[13px] font-medium text-[#64748b]">
                    Target: <span className="font-semibold text-[#1e293b]">{student.targetCountry ?? "Sesuai Program"}</span>
                    {student.nextSessionDate && (
                      <>
                        <span className="mx-2">•</span>
                        Next Session: {student.nextSessionDate}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 shrink-0">
                  {/* Progress Indicator */}
                  <div className="text-right">
                    <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider">Progress</span>
                    <p className="text-[18px] font-bold text-[#0f172a]">{student.progressPercent}%</p>
                  </div>

                  <a
                    href={`/consultant/students/${student.id}`}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#3b82f6] hover:text-white bg-white hover:bg-[#3b82f6] border border-[#e2e8f0] hover:border-[#3b82f6] px-5 py-2.5 rounded-xl transition-all"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-4 h-4" />
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