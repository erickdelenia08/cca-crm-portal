"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Clock,
    Plus,
    Trash2,
    Lock,
    Info,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    List,
    CalendarDays,
} from "lucide-react";
import { availabilitySchema, AvailabilityInput } from "@/schemas/availability.schema";
import { createAvailabilitySlots, deleteAvailabilitySlot } from "@/actions/availability.action";

type AvailabilityTemplate = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

type AvailabilityOverride = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
};

type BookingItem = {
    id: string;
    availabilityTemplateId: string | null;
    availabilityOverrideId: string | null;
    scheduledAt: Date;
    student: { fullName: string };
};

export function AvailabilityCalendar({
    templates,
    overrides,
    bookings,
}: {
    templates: AvailabilityTemplate[];
    overrides: AvailabilityOverride[];
    bookings: BookingItem[];
}) {
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [formMode, setFormMode] = useState<"date" | "recurring">("date");

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [filterStatus, setFilterStatus] = useState<"ALL" | "AVAILABLE" | "BOOKED">("ALL");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AvailabilityInput>({
        resolver: zodResolver(availabilitySchema),
        defaultValues: {
            type: "DATE",
            dayOfWeek: 1, // Senin
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "12:00",
            duration: 60,
        },
    });

    const watchType = watch("type");

    const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    // Combine templates, overrides, and bookings for a specific date
    const getSlotsForDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();

        // Get templates for this day of week
        const dayTemplates = templates.filter((t) => t.dayOfWeek === dayOfWeek);
        // Get overrides for this specific date
        const dateOverrides = overrides.filter((o) => o.date === dateStr);

        const mappedTemplates = dayTemplates.map((template) => {
            const booking = bookings.find((b) => {
                if (b.availabilityTemplateId !== template.id) return false;
                const bDate = new Date(b.scheduledAt);
                return (
                    bDate.getFullYear() === dateObj.getFullYear() &&
                    bDate.getMonth() === dateObj.getMonth() &&
                    bDate.getDate() === dateObj.getDate()
                );
            });

            return {
                id: template.id,
                slotType: "RECURRING" as const,
                dayName: DAY_NAMES[template.dayOfWeek],
                date: null,
                startTime: template.startTime,
                endTime: template.endTime,
                isBooked: !!booking,
                studentName: booking?.student.fullName || null,
            };
        });

        const mappedOverrides = dateOverrides.map((override) => {
            const booking = bookings.find((b) => b.availabilityOverrideId === override.id);
            return {
                id: override.id,
                slotType: "DATE" as const,
                dayName: DAY_NAMES[dayOfWeek],
                date: override.date,
                startTime: override.startTime,
                endTime: override.endTime,
                isBooked: !!booking,
                studentName: booking?.student.fullName || null,
            };
        });

        // Combine and sort by start time
        return [...mappedTemplates, ...mappedOverrides].sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    // Calculate slots for list view
    const allListSlots = [
        ...templates.map((template) => ({
            id: template.id,
            slotType: "RECURRING" as const,
            dayName: DAY_NAMES[template.dayOfWeek],
            date: null,
            startTime: template.startTime,
            endTime: template.endTime,
            isBooked: false,
            studentName: null,
        })),
        ...overrides.map((override) => {
            const booking = bookings.find((b) => b.availabilityOverrideId === override.id);
            const d = new Date(override.date);
            return {
                id: override.id,
                slotType: "DATE" as const,
                dayName: DAY_NAMES[d.getDay()],
                date: override.date,
                startTime: override.startTime,
                endTime: override.endTime,
                isBooked: !!booking,
                studentName: booking?.student.fullName || null,
            };
        })
    ].sort((a, b) => a.startTime.localeCompare(b.startTime));

    const displaySlots = viewMode === "calendar" ? getSlotsForDate(selectedDate) : allListSlots;

    const filteredSlots = displaySlots.filter((slot) => {
        if (filterStatus === "AVAILABLE") return !slot.isBooked;
        if (filterStatus === "BOOKED") return slot.isBooked;
        return true;
    });

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDateSelect = (dateStr: string) => {
        setSelectedDate(dateStr);
        setFormMode("date");
        setValue("type", "DATE");
        setValue("date", dateStr);
    };

    const onSubmit = async (data: AvailabilityInput) => {
        setIsSubmitting(true);
        setError(null);
        const res = await createAvailabilitySlots(data);
        if (!res.success) {
            setError(res.error || "Gagal membuat slot");
        }
        setIsSubmitting(false);
    };

    const handleDeleteSlot = async (id: string, isBooked: boolean, type: "RECURRING" | "DATE") => {
        if (isBooked) return;
        if (confirm(`Apakah Anda yakin ingin menghapus slot ${type === "RECURRING" ? "rutin" : "ini"}?`)) {
            const res = await deleteAvailabilitySlot(id, type);
            if (!res.success) {
                alert(res.error || "Gagal menghapus slot");
            }
        }
    };

    const renderCalendarGrid = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getFirstDayOfMonth(year, month);

        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50 border border-slate-100 rounded-lg"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const daySlots = getSlotsForDate(dateString);
            const isSelected = selectedDate === dateString;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateSelect(dateString)}
                    className={`h-24 p-2 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${isSelected
                            ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-slate-700"}`}>
                            {day}
                        </span>
                        {daySlots.length > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {daySlots.length} slot
                            </span>
                        )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                        {daySlots.slice(0, 2).map((s, idx) => (
                            <div
                                key={`${s.id}-${idx}`}
                                className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium ${s.isBooked
                                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    }`}
                            >
                                {s.startTime} {s.isBooked ? `(${s.studentName})` : "Tersedia"}
                            </div>
                        ))}
                        {daySlots.length > 2 && (
                            <div className="text-[9px] text-slate-400 font-medium pl-1">
                                +{daySlots.length - 2} lagi
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Pengaturan Availability & Slot Sesi
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola ketersediaan waktu Anda dengan memilih tanggal pada kalender interaktif.
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "calendar"
                                ? "bg-white text-blue-600 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        <CalendarIcon className="w-4 h-4" /> Kalender
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "list"
                                ? "bg-white text-blue-600 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        <List className="w-4 h-4" /> Daftar Semua Slot
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === "calendar" ? (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-blue-600" />
                                    {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                                </h2>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-1">
                                <span>Min</span>
                                <span>Sen</span>
                                <span>Sel</span>
                                <span>Rab</span>
                                <span>Kam</span>
                                <span>Jum</span>
                                <span>Sab</span>
                            </div>

                            <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
                        </div>
                    ) : null}

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    {viewMode === "calendar"
                                        ? `Slot pada ${selectedDate}`
                                        : "Semua Slot Terjadwal"}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Slot yang terbooking dikunci secara otomatis.
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setFilterStatus("ALL")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                                        }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setFilterStatus("AVAILABLE")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "AVAILABLE" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                                        }`}
                                >
                                    Tersedia
                                </button>
                                <button
                                    onClick={() => setFilterStatus("BOOKED")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${filterStatus === "BOOKED" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600"
                                        }`}
                                >
                                    Terbooking
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredSlots.length > 0 ? (
                                filteredSlots.map((slot, idx) => (
                                    <div
                                        key={`${slot.id}-${idx}`}
                                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${slot.isBooked
                                                ? "bg-amber-50/70 border-amber-200"
                                                : "bg-white border-slate-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                    {slot.slotType === "DATE" ? `📅 ${slot.date}` : `🔄 Rutin (${slot.dayName})`}
                                                </span>

                                                {slot.isBooked ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                                        <Lock className="w-3 h-3 text-amber-600" /> Terbooking
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tersedia
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-bold text-slate-900">
                                                    {slot.startTime} - {slot.endTime} WIB
                                                </span>
                                            </div>

                                            {slot.isBooked && (
                                                <p className="text-xs text-amber-900 font-medium">
                                                    Dipesan oleh: <strong>{slot.studentName}</strong>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {!slot.isBooked && (
                                                <button
                                                    onClick={() => handleDeleteSlot(slot.id, slot.isBooked, slot.slotType)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    Tidak ada slot yang tersedia.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Buka Slot Baru
                        </h2>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode("date");
                                    setValue("type", "DATE");
                                }}
                                className={`py-1.5 rounded-md transition-all ${formMode === "date" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                                    }`}
                            >
                                📅 Per Tanggal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode("recurring");
                                    setValue("type", "RECURRING");
                                }}
                                className={`py-1.5 rounded-md transition-all ${formMode === "recurring" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                                    }`}
                            >
                                🔄 Rutin Mingguan
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            {watchType === "DATE" ? (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Tanggal Terpilih
                                    </label>
                                    <input
                                        type="date"
                                        {...register("date")}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Pilih Hari Rutin
                                    </label>
                                    <select
                                        {...register("dayOfWeek")}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {DAY_NAMES.map((d, index) => (
                                            <option key={index} value={index}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Jam Mulai
                                    </label>
                                    <input
                                        type="time"
                                        {...register("startTime")}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Jam Selesai
                                    </label>
                                    <input
                                        type="time"
                                        {...register("endTime")}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Durasi Per Sesi
                                </label>
                                <select
                                    {...register("duration")}
                                    className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="30">30 Menit / Sesi</option>
                                    <option value="45">45 Menit / Sesi</option>
                                    <option value="60">60 Menit (1 Jam) / Sesi</option>
                                    <option value="90">90 Menit / Sesi</option>
                                </select>
                                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-xs mt-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? "Menyimpan..." : "Generate & Simpan Slot"}
                            </button>
                        </form>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 mt-6">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                                Slot yang terbooking tidak dapat dihapus. Gunakan menu <strong>Sesi</strong> untuk pembatalan atau memindahkan jadwal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
