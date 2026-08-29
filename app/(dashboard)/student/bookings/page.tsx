"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Info,
  X,
  Calendar,
  List,
  AlertCircle,
  RefreshCw,
  Ban,
  UserCheck,
} from "lucide-react";

// --- TYPES & DUMMY DATA ---
type BookingStatus = "Pending" | "Approved" | "Rejected" | "Completed";

interface Booking {
  id: string;
  sessionType: string;
  consultantName: string;
  dateTime: string; // ISO String format
  displayDate: string;
  displayTime: string;
  status: BookingStatus;
  topic: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    sessionType: "Academic Tutoring (Kalkulus)",
    consultantName: "Dr. Sarah Johnson",
    dateTime: "2026-09-02T14:00:00", // > 24 jam dari sekarang
    displayDate: "Rabu, 2 Sep 2026",
    displayTime: "14:00 - 15:00 WIB",
    status: "Approved",
    topic: "Persiapan Ujian Tengah Semester Bab Inegral",
  },
  {
    id: "b2",
    sessionType: "Career & University Consultation",
    consultantName: "Mark Thompson",
    dateTime: "2026-08-29T10:00:00", // < 24 jam (misal hari ini/besok pagi)
    displayDate: "Sabtu, 29 Agt 2026",
    displayTime: "10:00 - 11:00 WIB",
    status: "Pending",
    topic: "Review Essay Beasiswa LPDP",
  },
  {
    id: "b3",
    sessionType: "Academic Tutoring (Fisika)",
    consultantName: "Emily Chen",
    dateTime: "2026-08-20T13:00:00",
    displayDate: "Kamis, 20 Agt 2026",
    displayTime: "13:00 - 14:00 WIB",
    status: "Rejected",
    topic: "Hukum Newton dan Aplikasinya",
  },
];

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Helper untuk cek validasi H-24 Jam (24 jam sebelum sesi)
  const isMoreThan24HoursAway = (targetDateStr: string) => {
    const sessionTime = new Date(targetDateStr).getTime();
    const currentTime = new Date().getTime();
    const differenceInHours = (sessionTime - currentTime) / (1000 * 60 * 60);
    return differenceInHours >= 24;
  };

  // Filtering Data
  const filteredBookings = bookings.filter((item) => {
    if (activeTab === "All") return true;
    return item.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Action Handlers
  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: "Rejected" } : b
      )
    );
    setIsCancelModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola jadwal booking sesi konseling dan les yang telah Anda ajukan.
          </p>
        </div>

        {/* View Toggle (List vs Calendar) */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 self-start">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "list"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <List className="w-4 h-4" />
            Daftar List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "calendar"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Calendar className="w-4 h-4" />
            Kalender
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 -mb-px whitespace-nowrap ${activeTab === tab
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "All" ? "Semua Booking" : tab}
          </button>
        ))}
      </div>

      {/* CALENDAR VIEW MOCKUP */}
      {viewMode === "calendar" && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center py-12">
          <CalendarDays className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800">Tampilan Kalender</h3>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan {filteredBookings.length} booking pada grid kalender bulanan.
          </p>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <>
          {/* EMPTY STATE */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tidak ada booking ditemukan
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Belum ada pengajuan booking dengan status &quot;{activeTab}&quot;.
              </p>
            </div>
          ) : (
            /* BOOKING CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((booking) => {
                const canModify = isMoreThan24HoursAway(booking.dateTime);

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between gap-4"
                  >
                    {/* Header Card */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {booking.sessionType}
                        </span>
                        <h4 className="font-bold text-gray-800 text-base mt-0.5">
                          {booking.consultantName}
                        </h4>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${booking.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Meta Information */}
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        <span>{booking.displayDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{booking.displayTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Topik:</span>{" "}
                        {booking.topic}
                      </p>
                    </div>

                    {/* Action Area & H-24 Validation */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      {/* Tooltip Info jika kurang dari 24 jam */}
                      {!canModify && booking.status !== "Rejected" ? (
                        <div className="group relative flex items-center gap-1 text-xs text-amber-600">
                          <Info className="w-4 h-4" />
                          <span>Perubahan dikunci (H-24)</span>
                          {/* Tooltip Text */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-10">
                            Reschedule dan pembatalan hanya dapat dilakukan maksimal 24 jam sebelum sesi dimulai.
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-auto">
                        {/* Cancel Button */}
                        <button
                          disabled={!canModify || booking.status === "Rejected"}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsCancelModalOpen(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${canModify && booking.status !== "Rejected"
                            ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                            : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                            }`}
                        >
                          Cancel
                        </button>

                        {/* Reschedule Button */}
                        <button
                          disabled={!canModify || booking.status === "Rejected"}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsRescheduleModalOpen(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${canModify && booking.status !== "Rejected"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* --- MODAL CANCEL BOOKING --- */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Membatalkan Booking?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin membatalkan sesi bersama{" "}
                <strong>{selectedBooking.consultantName}</strong>?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="w-1/2 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={handleCancelBooking}
                className="w-1/2 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RESCHEDULE BOOKING --- */}
      {isRescheduleModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                Form Pengajuan Reschedule
              </h3>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p>
                <strong>Tutor:</strong> {selectedBooking.consultantName}
              </p>
              <p>
                <strong>Jadwal Lama:</strong> {selectedBooking.displayDate} (
                {selectedBooking.displayTime})
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pilih Tanggal Baru
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pilih Slot Waktu Baru
                </label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>09:00 - 10:00 WIB</option>
                  <option>13:00 - 14:00 WIB</option>
                  <option>15:30 - 16:30 WIB</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsRescheduleModalOpen(false);
                  alert("Pengajuan reschedule berhasil dikirim!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
              >
                Kirim Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}