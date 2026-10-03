"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    CheckCircle2,
    Ban,
    Settings2,
    X,
} from "lucide-react";
import { overrideBookingStatus } from "@/actions/management-portal.action";
import { BookingStatus } from "@prisma/client";

export type BookingItem = {
    id: string;
    studentName: string;
    consultantName: string;
    sessionType: string;
    date: string;
    timeSlot: string;
    status: BookingStatus;
    rawDate: Date;
};

interface BookingsClientProps {
    initialBookings: BookingItem[];
}

export function BookingsClient({ initialBookings }: BookingsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");

    // Modal state
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    
    const [targetConsultant, setTargetConsultant] = useState("Budi Santoso");
    const [consultantSlots, setConsultantSlots] = useState([
        { id: "SLOT-1", day: "Senin", time: "09:00 - 10:00 WIB", isAvailable: true },
        { id: "SLOT-2", day: "Senin", time: "10:00 - 11:00 WIB", isAvailable: false },
        { id: "SLOT-3", day: "Selasa", time: "13:00 - 14:00 WIB", isAvailable: true },
    ]);

    const filteredBookings = initialBookings.filter((item) => {
        const matchesSearch =
            item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleOverrideStatus = async (id: string, newStatus: BookingStatus) => {
        if (!confirm(`Are you sure you want to force change this booking to ${newStatus}?`)) return;
        
        try {
            const res = await overrideBookingStatus(id, newStatus);
            if (!res.success) {
                alert(`Error: ${res.error}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleSlot = (slotId: string) => {
        setConsultantSlots((prev) =>
            prev.map((slot) =>
                slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
            )
        );
    };

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 mb-2 tracking-wide uppercase">
                        <span>Management Oversight</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-800">Bookings</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        System Bookings
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        Complete oversight of all scheduled sessions. Override statuses manually or adjust consultant availability slots if required.
                    </p>
                </div>
                
                <button
                    onClick={() => setIsSlotModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-full overflow-hidden transition-all hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Settings2 className="w-4 h-4 text-blue-300 transition-transform group-hover:rotate-90" /> 
                    <span>Slot Availability</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search student, consultant, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full bg-slate-50/50 border-transparent text-sm font-medium rounded-xl py-3 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-900 outline-none"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto px-2 md:px-0">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-sm font-medium border-transparent bg-slate-50/50 rounded-xl py-3 px-4 min-w-[160px] focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-700 cursor-pointer outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">ID & Student</th>
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Consultant</th>
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Session</th>
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Schedule</th>
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{item.studentName}</span>
                                                <span className="text-[11px] font-mono text-slate-400 mt-0.5">{item.id.split('-')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{item.consultantName}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{item.sessionType}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-slate-800 font-semibold gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {item.date}
                                                </div>
                                                <div className="flex items-center text-slate-500 text-xs gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {item.timeSlot}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${item.status === "CONFIRMED"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                                    : item.status === "PENDING"
                                                        ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                                        : item.status === "COMPLETED"
                                                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                                            : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                                {item.status !== "CONFIRMED" && item.status !== "CANCELLED" && item.status !== "COMPLETED" && (
                                                    <button
                                                        title="Force Approve"
                                                        onClick={() => handleOverrideStatus(item.id, "CONFIRMED")}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {item.status !== "CANCELLED" && item.status !== "COMPLETED" && (
                                                    <button
                                                        title="Force Cancel"
                                                        onClick={() => handleOverrideStatus(item.id, "CANCELLED")}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Search className="w-8 h-8 mb-3 opacity-20" />
                                            <p className="text-sm font-medium text-slate-500">No bookings found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Drawer: Override Availability */}
            {isSlotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSlotModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Override Slots
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Temporarily block or open consultant schedules.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsSlotModalOpen(false)}
                                    className="p-2 -mr-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Target Consultant
                                    </label>
                                    <select
                                        value={targetConsultant}
                                        onChange={(e) => setTargetConsultant(e.target.value)}
                                        className="w-full text-sm font-medium border-2 border-slate-200 rounded-xl p-3 bg-white focus:outline-hidden focus:border-blue-600 transition-colors"
                                    >
                                        <option value="Budi Santoso">Budi Santoso (Senior)</option>
                                        <option value="Dewi Lestari">Dewi Lestari (Specialist)</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Upcoming Slots
                                    </label>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
                                        {consultantSlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group border border-transparent hover:border-slate-200 transition-all"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {slot.day}, {slot.time}
                                                    </p>
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${slot.isAvailable ? "text-emerald-600" : "text-rose-600"}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${slot.isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                                        {slot.isAvailable ? "Available" : "Blocked"}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleToggleSlot(slot.id)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${slot.isAvailable
                                                        ? "bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-sm"
                                                        : "bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm"
                                                        }`}
                                                >
                                                    {slot.isAvailable ? "Block Slot" : "Open Slot"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsSlotModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
