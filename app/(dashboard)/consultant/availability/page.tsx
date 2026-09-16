import React from "react";
import { redirect } from "next/navigation";
import { getAvailabilityTemplates, getAvailabilityOverrides, getBookingsForCalendar } from "@/actions/availability.action";
import { AvailabilityCalendar } from "@/components/availability-calendar";

export default async function AvailabilityPage() {
    // Fetch data via Server Actions
    const templatesRes = await getAvailabilityTemplates();
    const overridesRes = await getAvailabilityOverrides();
    const bookingsRes = await getBookingsForCalendar();

    if (!templatesRes.success || !bookingsRes.success || !overridesRes.success) {
        if (templatesRes.error === "UNAUTHORIZED" || bookingsRes.error === "UNAUTHORIZED" || overridesRes.error === "UNAUTHORIZED") {
            redirect("/login");
        }
        
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {templatesRes.error || bookingsRes.error || overridesRes.error || "Gagal memuat data availability."}
                </div>
            </div>
        );
    }

    return (
        <AvailabilityCalendar 
            templates={templatesRes.data || []} 
            overrides={overridesRes.data || []}
            bookings={bookingsRes.data || []} 
        />
    );
}