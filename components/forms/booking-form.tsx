"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Calendar as CalendarIcon,
    Clock,
    UserCheck,
    Video,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { BookingInput, bookingSchema } from "@/schemas/booking.schema";
import { createStudentBooking } from "@/actions/booking.action";

type AssignedConsultant = {
    id: string;
    fullName: string;
    specialization: string | null;
};

type AvailabilityTemplate = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
};

type AvailabilityOverride = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
};

type BookingReference = {
    id: string;
    scheduledAt: Date;
    availabilityTemplateId: string | null;
    availabilityOverrideId: string | null;
};

export function BookingForm({
    consultant,
    templates,
    overrides,
    bookings,
}: {
    consultant: AssignedConsultant;
    templates: AvailabilityTemplate[];
    overrides: AvailabilityOverride[];
    bookings: BookingReference[];
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<BookingInput>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            consultantId: consultant.id,
            sessionType: "CONSULTATION",
            date: new Date().toISOString().split("T")[0],
            startTime: "",
            endTime: "",
            topic: "",
        },
        mode: "onChange"
    });

    const watchSessionType = watch("sessionType");
    const watchDate = watch("date");
    const watchStartTime = watch("startTime");
    const watchTopic = watch("topic");

    // Merge logic for the selected date
    const getSlotsForDate = (dateStr: string) => {
        if (!dateStr) return [];
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();

        // 1. Get templates for this day of week
        const dayTemplates = templates.filter((t) => t.dayOfWeek === dayOfWeek && t.isActive);

        // 2. Get overrides for this specific date
        const dateOverrides = overrides.filter((o) => o.date === dateStr);

        // Compute template slots
        const mappedTemplates = dayTemplates.map((template) => {
            const isBooked = bookings.some((b) => {
                if (b.availabilityTemplateId !== template.id) return false;
                const bDate = new Date(b.scheduledAt);
                return (
                    bDate.getFullYear() === dateObj.getFullYear() &&
                    bDate.getMonth() === dateObj.getMonth() &&
                    bDate.getDate() === dateObj.getDate()
                );
            });

            return {
                sourceId: template.id,
                sourceType: "TEMPLATE" as const,
                startTime: template.startTime,
                endTime: template.endTime,
                isAvailable: !isBooked,
            };
        });

        // Compute override slots
        const mappedOverrides = dateOverrides.map((override) => {
            const isBooked = bookings.some((b) => b.availabilityOverrideId === override.id);
            return {
                sourceId: override.id,
                sourceType: "OVERRIDE" as const,
                startTime: override.startTime,
                endTime: override.endTime,
                isAvailable: override.isAvailable && !isBooked, // Overrides can explicitly mark isAvailable=false to block a slot
            };
        });

        return [...mappedTemplates, ...mappedOverrides]
            .filter((slot) => slot.isAvailable) // Only show actual available slots in this view
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const currentAvailableSlots = getSlotsForDate(watchDate);

    const onSubmit = async (data: BookingInput) => {
        setIsSubmitting(true);
        setSubmitError(null);

        const res = await createStudentBooking(data);

        if (res.success) {
            setIsSubmitted(true);
        } else {
            setSubmitError(res.error || "Gagal membuat jadwal bimbingan.");
        }

        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-slate-200 rounded-xl text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Pengajuan Bimbingan Terkirim</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Jadwal konsultasi telah diajukan ke <span className="font-semibold text-slate-900">{consultant.fullName}</span> untuk tanggal <span className="font-semibold text-slate-900">{watchDate}</span> jam <span className="font-semibold text-slate-900">{watchStartTime}</span>.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        reset();
                        setValue("date", new Date().toISOString().split("T")[0]);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer mt-4"
                >
                    Buat Janji Lain
                </button>
            </div>
        );
    }

    // Helper avatar initials
    const initials = consultant.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel Kiri: Form & Kalender Interaktif */}
            <div className="lg:col-span-2 space-y-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">

                {submitError && (
                    <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium">
                        {submitError}
                    </div>
                )}

                {/* Info Konsultan */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900">{consultant.fullName}</p>
                        <p className="text-[11px] text-slate-500">{consultant.specialization || "Konsultan Utama"}</p>
                    </div>
                </div>

                {/* 1. Tipe Konsultasi */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        1. Tipe Bimbingan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setValue("sessionType", "CONSULTATION", { shouldValidate: true })}
                            className={`p-3 rounded-lg border text-left text-xs transition-all ${watchSessionType === "CONSULTATION"
                                ? "border-blue-600 bg-blue-50/50 text-blue-950 font-bold"
                                : "border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
                                }`}
                        >
                            Konsultasi Utama
                            <span className="block text-[11px] text-slate-500 font-normal mt-0.5">Jurusan & Visa</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue("sessionType", "DOCUMENT_REVIEW", { shouldValidate: true })}
                            className={`p-3 rounded-lg border text-left text-xs transition-all ${watchSessionType === "DOCUMENT_REVIEW"
                                ? "border-blue-600 bg-blue-50/50 text-blue-950 font-bold"
                                : "border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
                                }`}
                        >
                            Review Dokumen
                            <span className="block text-[11px] text-slate-500 font-normal mt-0.5">Essay & Persyaratan</span>
                        </button>
                    </div>
                </div>

                {/* 2. Kalender & Pemilihan Slot Waktu */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        2. Pilih Tanggal & Slot Kosong
                    </label>

                    {/* Input Tanggal Simple */}
                    <div className="mb-3">
                        <input
                            type="date"
                            {...register("date")}
                            onChange={(e) => {
                                setValue("date", e.target.value);
                                setValue("startTime", "");
                                setValue("endTime", "");
                                setValue("availabilityTemplateId", undefined);
                                setValue("availabilityOverrideId", undefined);
                            }}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>

                    {/* Grid Slot Jam */}
                    <div className="space-y-1.5">
                        <p className="text-[11px] text-slate-500 font-medium">Slot Waktu Tersedia ({watchDate}):</p>

                        {currentAvailableSlots.length === 0 ? (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
                                Tidak ada slot tersedia pada tanggal ini.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {currentAvailableSlots.map((slot, idx) => {
                                    const isSelected = watchStartTime === slot.startTime;

                                    return (
                                        <button
                                            key={`${slot.sourceId}-${idx}`}
                                            type="button"
                                            onClick={() => {
                                                setValue("startTime", slot.startTime, { shouldValidate: true });
                                                setValue("endTime", slot.endTime, { shouldValidate: true });

                                                if (slot.sourceType === "TEMPLATE") {
                                                    setValue("availabilityTemplateId", slot.sourceId);
                                                    setValue("availabilityOverrideId", undefined);
                                                } else {
                                                    setValue("availabilityOverrideId", slot.sourceId);
                                                    setValue("availabilityTemplateId", undefined);
                                                }
                                            }}
                                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${isSelected
                                                ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                : "bg-white border-slate-200 hover:border-blue-500 text-slate-700"
                                                }`}
                                        >
                                            {slot.startTime} - {slot.endTime}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>
                </div>

                {/* 3. Topik Discussion */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        3. Topik Pembahasan
                    </label>
                    <textarea
                        rows={3}
                        {...register("topic")}
                        placeholder="Tuliskan hal utama yang ingin Anda konsultasikan..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic.message}</p>}
                </div>
            </div>

            {/* Panel Kanan: Ringkasan & Submit */}
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 sticky top-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Ringkasan Sesi
                    </h3>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                            <UserCheck className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">{consultant.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">{watchDate || "Pilih tanggal"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">{watchStartTime || "Pilih slot jam"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Video className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">Zoom Meeting</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex gap-2 items-start">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                            Slot yang Anda pilih akan langsung diajukan ke konsultan dan menunggu persetujuan (PENDING).
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`w-full py-2.5 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs ${!isValid || isSubmitting
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            }`}
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                    </button>
                </div>
            </div>
        </form>
    );
}
