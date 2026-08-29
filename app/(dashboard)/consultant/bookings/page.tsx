"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronRight,
  Send,
} from "lucide-react";

type BookingStatus =
  | "pending"
  | "approved"
  | "reschedule_requested_by_student"
  | "reschedule_requested_by_consultant"
  | "rejected_reschedule"
  | "cancelled";

export default function ConsultantBookingsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "reschedule" | "upcoming" | "past">("pending");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Mock Data Booking
  const [bookings, setBookings] = useState([
    {
      id: "b1",
      studentName: "Budi Santoso",
      topic: "Review Portfolio UI/UX & Feedback CV",
      date: "2026-09-02",
      time: "10:00 - 11:00 WIB",
      status: "pending" as BookingStatus,
      proposedDate: null,
      proposedTime: null,
    },
    {
      id: "b2",
      studentName: "Siti Rahma",
      topic: "Persiapan Interview Senior Frontend Developer",
      date: "2026-09-03",
      time: "14:00 - 15:00 WIB",
      status: "reschedule_requested_by_student" as BookingStatus,
      proposedDate: "2026-09-05",
      proposedTime: "15:00 - 16:00 WIB",
    },
    {
      id: "b3",
      studentName: "Andi Wijaya",
      topic: "Konsultasi System Design & Microservices",
      date: "2026-09-04",
      time: "13:00 - 14:00 WIB",
      status: "reschedule_requested_by_consultant" as BookingStatus,
      proposedDate: "2026-09-06",
      proposedTime: "10:00 - 11:00 WIB",
    },
    {
      id: "b4",
      studentName: "Dewi Lestari",
      topic: "Career Mentoring & Transition to Tech",
      date: "2026-09-01",
      time: "09:00 - 10:00 WIB",
      status: "approved" as BookingStatus,
      proposedDate: null,
      proposedTime: null,
    },
    {
      id: "b5",
      studentName: "Rizky Pratama",
      topic: "Mock Interview Algorithm & Data Structure",
      date: "2026-08-20",
      time: "16:00 - 17:00 WIB",
      status: "approved" as BookingStatus,
      proposedDate: null,
      proposedTime: null,
    },
  ]);

  // Handler Status
  const handleApproveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
  };

  const handleRejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const handleApproveReschedule = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
            ...b,
            date: b.proposedDate || b.date,
            time: b.proposedTime || b.time,
            status: "approved",
            proposedDate: null,
            proposedTime: null,
          }
          : b
      )
    );
  };

  const handleRejectReschedule = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
            ...b,
            status: "rejected_reschedule",
            proposedDate: null,
            proposedTime: null,
          }
          : b
      )
    );
  };

  // Badge Status Renderer
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock3 className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Kamu (Approval)
          </span>
        );
      case "reschedule_requested_by_student":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            Menunggu Kamu (Reschedule Siswa)
          </span>
        );
      case "reschedule_requested_by_consultant":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock3 className="w-3.5 h-3.5 text-blue-600" />
            Menunggu Siswa (Pengajuan Kamu)
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Terkonfirmasi
          </span>
        );
      case "rejected_reschedule":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            Reschedule Ditolak (Jadwal Lama Aktif)
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Dibatalkan
          </span>
        );
    }
  };

  // Tab Filtering
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const rescheduleBookings = bookings.filter(
    (b) =>
      b.status === "reschedule_requested_by_student" ||
      b.status === "reschedule_requested_by_consultant"
  );
  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === "approved" || b.status === "rejected_reschedule") &&
      new Date(b.date) >= new Date("2026-08-29")
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date("2026-08-29")
  );

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kelola Permintaan & Jadwal Booking
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Konfirmasi permintaan sesi dari siswa, kelola pengajuan reschedule, dan pantau seluruh sesi konsultasi.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === "pending"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Pending Approval
          {pendingBookings.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-[10px] bg-amber-500 text-white rounded-full">
              {pendingBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reschedule")}
          className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === "reschedule"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Reschedule Requests
          {rescheduleBookings.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-[10px] bg-purple-600 text-white rounded-full">
              {rescheduleBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === "upcoming"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Upcoming Sessions ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === "past"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-slate-500 hover:text-slate-900"
            }`}
        >
          Riwayat Sesi ({pastBookings.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* 1. PENDING APPROVAL TAB */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(booking.status)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {booking.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {booking.studentName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.time}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      onClick={() => handleRejectBooking(booking.id)}
                      className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleApproveBooking(booking.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      Setujui Booking
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                Tidak ada permintaan booking yang menunggu konfirmasi.
              </div>
            )}
          </div>
        )}

        {/* 2. RESCHEDULE REQUESTS TAB */}
        {activeTab === "reschedule" && (
          <div className="space-y-4">
            {rescheduleBookings.length > 0 ? (
              rescheduleBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(booking.status)}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Topik: {booking.topic}
                    </span>
                  </div>

                  {/* Perbandingan Jadwal Lama vs Baru */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <p className="font-semibold text-slate-500 mb-1">
                        Jadwal Semula:
                      </p>
                      <p className="font-bold text-slate-800">
                        {booking.date} | {booking.time}
                      </p>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                      <p className="font-semibold text-purple-700 mb-1">
                        Usulan Jadwal Baru:
                      </p>
                      <p className="font-bold text-purple-900">
                        {booking.proposedDate} | {booking.proposedTime}
                      </p>
                    </div>
                  </div>

                  {/* Actions Berdasarkan Siapa Pengaju Reschedule */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-600">
                      Siswa: <strong>{booking.studentName}</strong>
                    </span>

                    {booking.status === "reschedule_requested_by_student" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectReschedule(booking.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                        >
                          Tolak (Jadwal Lama Tetap)
                        </button>
                        <button
                          onClick={() => handleApproveReschedule(booking.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-2xs"
                        >
                          Terima Jadwal Baru
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs italic text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        Menunggu persetujuan perubahan dari siswa...
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                Tidak ada permintaan reschedule aktif saat ini.
              </div>
            )}
          </div>
        )}

        {/* 3. UPCOMING SESSIONS TAB */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(booking.status)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {booking.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {booking.studentName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.time}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Ajukan Reschedule */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setShowRescheduleModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                      Ajukan Reschedule
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                Belum ada sesi mendatang yang terkonfirmasi.
              </div>
            )}
          </div>
        )}

        {/* 4. PAST SESSIONS TAB */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 opacity-80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Selesai
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {booking.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Siswa: {booking.studentName}</span>
                      <span>•</span>
                      <span>
                        {booking.date} ({booking.time})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                Belum ada riwayat sesi masa lalu.
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL AJUKAN RESCHEDULE OLEH KONSULTAN */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Ajukan Reschedule Jadwal
            </h3>
            <p className="text-xs text-slate-500">
              Pengajuan ini akan dikirim ke siswa untuk disetujui. Jadwal belum akan berubah sebelum siswa menyetujuinya.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Tanggal Baru
                </label>
                <input
                  type="date"
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Waktu Baru
                </label>
                <input
                  type="time"
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (selectedBookingId) {
                    setBookings((prev) =>
                      prev.map((b) =>
                        b.id === selectedBookingId
                          ? {
                            ...b,
                            status: "reschedule_requested_by_consultant",
                            proposedDate: "2026-09-08",
                            proposedTime: "11:00 - 12:00 WIB",
                          }
                          : b
                      )
                    );
                  }
                  setShowRescheduleModal(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}