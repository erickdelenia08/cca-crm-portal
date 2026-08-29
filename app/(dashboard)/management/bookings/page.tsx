"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    Ban,
    Settings2,
    X,
    Plus,
    Trash2,
    AlertTriangle,
    ChevronRight,
} from "lucide-react";

// Tipe Data Booking & Availability
type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type BookingItem = {
    id: string;
    studentName: string;
    consultantName: string;
    sessionType: string;
    date: string;
    timeSlot: string;
    status: BookingStatus;
};

type ConsultantSlot = {
    id: string;
    day: string;
    time: string;
    isAvailable: boolean;
};

export default function AdminBookingsPage() {
    // Mock Data Booking Sistem
    const [bookings, setBookings] = useState<BookingItem[]>([
        {
            id: "BK-3091",
            studentName: "Siti Rahmawati",
            consultantName: "Budi Santoso",
            sessionType: "Konsultasi Beasiswa S2",
            date: "2026-09-02",
            timeSlot: "10:00 - 11:00 WIB",
            status: "Pending",
        },
        {
            id: "BK-3088",
            studentName: "Ahmad Fauzi",
            consultantName: "Dewi Lestari",
            sessionType: "Review Personal Statement",
            date: "2026-09-01",
            timeSlot: "14:00 - 15:00 WIB",
            status: "Confirmed",
        },
        {
            id: "BK-3075",
            studentName: "Rian Hidayat",
            consultantName: "Budi Santoso",
            sessionType: "Simulasi Wawancara",
            date: "2026-08-28",
            timeSlot: "13:00 - 14:00 WIB",
            status: "Completed",
        },
        {
            id: "BK-3060",
            studentName: "Nadia Putri",
            consultantName: "Dewi Lestari",
            sessionType: "Konsultasi Beasiswa S2",
            date: "2026-08-30",
            timeSlot: "09:00 - 10:00 WIB",
            status: "Cancelled",
        },
    ]);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedConsultant, setSelectedConsultant] = useState<string>("All");

    // State Override Availability Modal
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [targetConsultant, setTargetConsultant] = useState("Budi Santoso");
    const [consultantSlots, setConsultantSlots] = useState<ConsultantSlot[]>([
        { id: "SLOT-1", day: "Senin", time: "09:00 - 10:00 WIB", isAvailable: true },
        { id: "SLOT-2", day: "Senin", time: "10:00 - 11:00 WIB", isAvailable: false },
        { id: "SLOT-3", day: "Selasa", time: "13:00 - 14:00 WIB", isAvailable: true },
        { id: "SLOT-4", day: "Rabu", time: "14:00 - 15:00 WIB", isAvailable: true },
    ]);

    // Filter Logic
    const filteredBookings = bookings.filter((item) => {
        const matchesSearch =
            item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
        const matchesConsultant =
            selectedConsultant === "All" || item.consultantName === selectedConsultant;
        return matchesSearch && matchesStatus && matchesConsultant;
    });

    // Handler Manual Override Status Booking
    const handleOverrideStatus = (id: string, newStatus: BookingStatus) => {
        const updated = bookings.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
        );
        setBookings(updated);
        alert(`[Override Admin] Status booking ${id} berhasil diubah ke: ${newStatus}`);
    };

    // Handler Toggle Availability Slot
    const handleToggleSlot = (slotId: string) => {
        setConsultantSlots((prev) =>
            prev.map((slot) =>
                slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
            )
        );
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Pengawasan Booking Sistem (Bookings Oversight)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola seluruh reservasi sesi, lakukan override status manual, dan atur ketersediaan slot konsultan.
                    </p>
                </div>

                <button
                    onClick={() => setIsSlotModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
                >
                    <Settings2 className="w-4 h-4 text-blue-400" /> Override Slot Availability
                </button>
            </div>

            {/* Baris Filter & Search */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 justify-between items-center">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari siswa, konsultan, ID booking..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                    />
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <select
                        value={selectedConsultant}
                        onChange={(e) => setSelectedConsultant(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Konsultan</option>
                        <option value="Budi Santoso">Budi Santoso</option>
                        <option value="Dewi Lestari">Dewi Lestari</option>
                    </select>
                </div>
            </div>

            {/* Tabel Master Bookings */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID & Siswa</th>
                                <th className="p-4">Konsultan</th>
                                <th className="p-4">Jenis Sesi</th>
                                <th className="p-4">Jadwal Sesi</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Manual Override Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{item.studentName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.id}</p>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-800">{item.consultantName}</td>
                                        <td className="p-4 text-slate-700">{item.sessionType}</td>
                                        <td className="p-4">
                                            <div className="space-y-0.5">
                                                <p className="font-medium text-slate-800 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                                                </p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-slate-400" /> {item.timeSlot}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.status === "Confirmed"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : item.status === "Pending"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : item.status === "Completed"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                {item.status !== "Confirmed" && (
                                                    <button
                                                        title="Force Approve"
                                                        onClick={() => handleOverrideStatus(item.id, "Confirmed")}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                )}

                                                {item.status !== "Cancelled" && (
                                                    <button
                                                        title="Force Cancel"
                                                        onClick={() => handleOverrideStatus(item.id, "Cancelled")}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-400 text-xs">
                                        Tidak ada data booking yang sesuai dengan kriteria pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL / DRAWER: OVERRIDE AVAILABILITY SLOT KONSULTAN */}
            {isSlotModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden space-y-4">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Override Availability Slot Konsultan
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Ubah ketersediaan jadwal konsultan secara langsung.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSlotModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 pt-0 space-y-4">
                            {/* Konsultan Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Pilih Konsultan
                                </label>
                                <select
                                    value={targetConsultant}
                                    onChange={(e) => setTargetConsultant(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                                >
                                    <option value="Budi Santoso">Budi Santoso (Senior Consultant)</option>
                                    <option value="Dewi Lestari">Dewi Lestari (Essay Specialist)</option>
                                </select>
                            </div>

                            {/* List Slot Jadwal */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Daftar Slot Konsultan ({targetConsultant})
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {consultantSlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">
                                                    {slot.day}, {slot.time}
                                                </p>
                                                <span
                                                    className={`text-[10px] font-bold ${slot.isAvailable ? "text-emerald-600" : "text-rose-600"
                                                        }`}
                                                >
                                                    {slot.isAvailable ? "Slot Tersedia" : "Slot Terkunci / Diblokir"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleToggleSlot(slot.id)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${slot.isAvailable
                                                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                    }`}
                                            >
                                                {slot.isAvailable ? "Blokir Slot" : "Buka Slot"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsSlotModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                Selesai Pengaturan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}