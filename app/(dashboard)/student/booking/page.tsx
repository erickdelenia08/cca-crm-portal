import React from "react";
import { redirect } from "next/navigation";
import { getAssignedConsultant, getConsultantAvailability } from "@/actions/booking.action";
import { BookingForm } from "@/components/forms/booking-form";

export default async function ClientBookingPage() {
    // 1. Ambil konsultan yang ditugaskan ke student login saat ini
    const consultantRes = await getAssignedConsultant();

    if (!consultantRes.success) {
        if (consultantRes.error === "UNAUTHORIZED") {
            redirect("/login");
        }

        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                    {consultantRes.error || "Gagal memuat konsultan."}
                </div>
            </div>
        );
    }

    const assignedConsultant = consultantRes.data!;

    // 2. Ambil ketersediaan (template, override, dan slot terbooking)
    const availabilityRes = await getConsultantAvailability(assignedConsultant.id);

    if (!availabilityRes.success) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {availabilityRes.error || "Gagal memuat jadwal."}
                </div>
            </div>
        );
    }

    const { templates, overrides, bookings } = availabilityRes.data!;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-800">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Jadwalkan Sesi Bimbingan</h1>
                <p className="text-xs text-slate-500 mt-1">
                    Pilih waktu ketersediaan konsultan pendamping Anda di bawah ini.
                </p>
            </div>

            <BookingForm
                consultant={assignedConsultant}
                templates={templates}
                overrides={overrides}
                bookings={bookings}
            />
        </div>
    );
}