"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    Trash2,
    Lock,
    Info,
    CalendarPlus,
    CalendarDays,
    CheckCircle2
} from "lucide-react";

export default function AvailabilityPage() {
    // Mode Form: Recurring (Mingguan) vs Specific Date (Manual Per Tanggal)
    const [formMode, setFormMode] = useState<"recurring" | "date">("date");

    // Form State untuk Tambah Slot Manual Per Tanggal & Recurring
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDay, setSelectedDay] = useState("Senin");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("12:00");
    const [duration, setDuration] = useState("60"); // Dalam menit (auto-split)

    // Filter Tampilan Slot (Semua, Terbooking, Tersedia)
    const [filterStatus, setFilterStatus] = useState<"ALL" | "AVAILABLE" | "BOOKED">("ALL");

    // Mock Data List Slot Aktif
    const [slots, setSlots] = useState([
        {
            id: "s1",
            type: "DATE", // 'DATE' (Manual Per Tanggal) atau 'RECURRING'
            date: "2026-09-01",
            dayName: "Selasa",
            startTime: "09:00",
            endTime: "10:00",
            isBooked: true,
            studentName: "Budi Santoso",
        },
        {
            id: "s2",
            type: "DATE",
            date: "2026-09-01",
            dayName: "Selasa",
            startTime: "10:00",
            endTime: "11:00",
            isBooked: false,
            studentName: null,
        },
        {
            id: "s3",
            type: "DATE",
            date: "2026-09-01",
            dayName: "Selasa",
            startTime: "11:00",
            endTime: "12:00",
            isBooked: false,
            studentName: null,
        },
        {
            id: "s4",
            type: "RECURRING",
            date: null,
            dayName: "Kamis",
            startTime: "14:00",
            endTime: "15:00",
            isBooked: true,
            studentName: "Siti Rahma",
        },
        {
            id: "s5",
            type: "RECURRING",
            date: null,
            dayName: "Kamis",
            startTime: "15:00",
            endTime: "16:00",
            isBooked: false,
            studentName: null,
        },
    ]);

    // Handler Hapus Slot (Hanya untuk yang belum terbooking)
    const handleDeleteSlot = (id: string, isBooked: boolean) => {
        if (isBooked) return;
        setSlots(slots.filter((s) => s.id !== id));
    };

    // Filtered Slot List
    const filteredSlots = slots.filter((slot) => {
        if (filterStatus === "AVAILABLE") return !slot.isBooked;
        if (filterStatus === "BOOKED") return slot.isBooked;
        return true;
    });

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pengaturan Availability & Slot Sesi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Kelola jam kerja rutin atau buka slot manual per tanggal khusus untuk konsultasi siswa.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. FORM TAMBAH SLOT MANUAL PER TANGGAL / RECURRING */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" />
                                Tambah Slot Sesi
                            </h2>
                        </div>

                        {/* Switcher Mode: Manual Per Tanggal vs Template Mingguan */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setFormMode("date")}
                                className={`py-1.5 rounded-md transition-all ${formMode === "date"
                                    ? "bg-white text-blue-600 shadow-2xs"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                📅 Per Tanggal
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormMode("recurring")}
                                className={`py-1.5 rounded-md transition-all ${formMode === "recurring"
                                    ? "bg-white text-blue-600 shadow-2xs"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                🔄 Per Hari (Rutin)
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            {/* Input Tanggal Manual */}
                            {formMode === "date" ? (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Pilih Tanggal Sesi
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Pilih Hari Rutin
                                    </label>
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                                    >
                                        {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Rentang Waktu (Jam Mulai & Selesai) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Jam Mulai
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Jam Selesai
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Durasi Per Sesi (Auto-Split Engine) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Durasi Sesi (Auto-Split)
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500"
                                >
                                    <option value="30">30 Menit / Sesi</option>
                                    <option value="45">45 Menit / Sesi</option>
                                    <option value="60">60 Menit (1 Jam) / Sesi</option>
                                    <option value="90">90 Menit / Sesi</option>
                                </select>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Sistem akan memecah jam {startTime || "09:00"} s/d {endTime || "12:00"} menjadi slot @{duration} menit.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-2xs mt-2"
                            >
                                Generate & Simpan Slot
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. LIST SLOT AKTIF & VISUAL INDIKATOR */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                        {/* Header List & Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-blue-600" />
                                    Daftar Slot Terjadwal
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Kelola slot aktif. Slot terbooking dilindungi dan tidak dapat dihapus langsung.
                                </p>
                            </div>

                            {/* Filter Status Badge */}
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setFilterStatus("ALL")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                                        }`}
                                >
                                    Semua ({slots.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("AVAILABLE")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "AVAILABLE" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600"
                                        }`}
                                >
                                    Tersedia ({slots.filter(s => !s.isBooked).length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("BOOKED")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "BOOKED" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600"
                                        }`}
                                >
                                    Terbooking ({slots.filter(s => s.isBooked).length})
                                </button>
                            </div>
                        </div>

                        {/* List Slot Aktif Grid */}
                        <div className="space-y-3">
                            {filteredSlots.length > 0 ? (
                                filteredSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${slot.isBooked
                                            ? "bg-amber-50/70 border-amber-200"
                                            : "bg-white border-slate-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {/* Badge Tipe Slot */}
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                    {slot.type === "DATE" ? `📅 ${slot.date}` : `🔄 Rutin (${slot.dayName})`}
                                                </span>

                                                {/* Badge Status Terbooking / Tersedia */}
                                                {slot.isBooked ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                                        <Lock className="w-3 h-3 text-amber-600" />
                                                        Terbooking
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        Tersedia
                                                    </span>
                                                )}
                                            </div>

                                            {/* Jam Sesi */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-bold text-slate-900">
                                                    {slot.startTime} - {slot.endTime} WIB
                                                </span>
                                            </div>

                                            {/* Info Siswa jika sudah terbooking */}
                                            {slot.isBooked && (
                                                <p className="text-xs text-amber-900 font-medium">
                                                    Dipesan oleh: <strong>{slot.studentName}</strong>
                                                </p>
                                            )}
                                        </div>

                                        {/* Akses Edit / Hapus */}
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {slot.isBooked ? (
                                                /* Slot Terbooking Terkunci (Proteksi Data) */
                                                <div
                                                    title="Slot yang sudah dipesan tidak dapat dihapus langsung. Pembatalan harus dilakukan lewat menu Reject/Reschedule Booking."
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-lg cursor-not-allowed select-none"
                                                >
                                                    <Lock className="w-3.5 h-3.5" />
                                                    Terkunci
                                                </div>
                                            ) : (
                                                /* Slot Belum Terbooking Boleh Dihapus */
                                                <button
                                                    onClick={() => handleDeleteSlot(slot.id, slot.isBooked)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Hapus Slot
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    Tidak ada slot yang sesuai dengan filter ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informasi Aturan Penguncian Slot */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900 leading-relaxed">
                            <span className="font-bold block mb-0.5">Aturan Proteksi Slot Terbooking:</span>
                            Slot dengan status <strong>Terbooking</strong> terkunci otomatis untuk menjaga kepastian jadwal siswa. Jika ingin membatalkan slot ini, lakukan reject atau atur ulang jadwal melalui menu <Link href="/consultant/sessions" className="underline font-bold hover:text-amber-950">Bookings Pending / Sesi</Link>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}