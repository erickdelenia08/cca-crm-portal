import { getAllBookings } from "@/actions/management-portal.action";
import { BookingsClient, BookingItem } from "./bookings-client";
import { format } from "date-fns";

export default async function AdminBookingsPage() {
    const response = await getAllBookings();
    
    let bookings: BookingItem[] = [];

    if (response.success && response.data) {
        bookings = response.data.map((b) => ({
            id: b.id,
            studentName: b.client?.clientProfile?.fullName || b.client?.name || "Unknown Student",
            consultantName: b.consultant?.consultantProfile?.fullName || b.consultant?.name || "Unknown Consultant",
            sessionType: b.sessionType,
            date: format(new Date(b.scheduledAt), "yyyy-MM-dd"),
            timeSlot: `${format(new Date(b.scheduledAt), "HH:mm")} - ${format(new Date(new Date(b.scheduledAt).getTime() + b.durationMinutes * 60000), "HH:mm")} WIB`,
            status: b.status,
            rawDate: new Date(b.scheduledAt)
        }));
    }

    return (
        <BookingsClient initialBookings={bookings} />
    );
}