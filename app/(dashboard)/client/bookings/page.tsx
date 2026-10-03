import React from "react";
import Link from "next/link";
import { getClientSchedule, ClientScheduleItem } from "@/actions/client-portal.action";
import { CalendarClock, Clock, User, Video, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientBookingsPage() {
    const res = await getClientSchedule();
    const bookings = res.data || [];

    if (!res.success) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    Gagal memuat jadwal: {res.error}
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CalendarClock className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Belum ada jadwal sesi.</h2>
                    <p className="text-slate-500 max-w-sm mb-6">Kamu belum memiliki jadwal kelas atau booking konsultasi apa pun.</p>
                    <Link href="/client/bookings/new" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Buat Booking Baru
                    </Link>
                </div>
            </div>
        );
    }

    const upcoming = bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED");
    const past = bookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED");

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Schedule</h1>
                    <p className="text-slate-500 mt-2">Daftar jadwal kelas dan konsultasi kamu.</p>
                </div>
                <Link href="/client/bookings/new" className="hidden sm:inline-flex px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Buat Jadwal Baru
                </Link>
            </div>

            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Upcoming Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcoming.map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 mt-8 border-t border-slate-200 pt-8">Past Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {past.map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function BookingCard({ booking }: { booking: ClientScheduleItem }) {
    const isUpcoming = booking.status === "PENDING" || booking.status === "CONFIRMED";

    return (
        <div className={cn(
            "flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
            !isUpcoming && "opacity-70 hover:opacity-100"
        )}>
            <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 block w-fit",
                            booking.type === "COURSE_SESSION" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                        )}>
                            {booking.contextName || (booking.type === "COURSE_SESSION" ? "Class" : "Advisory")}
                        </span>
                        <h3 className="font-bold text-slate-900 capitalize text-lg">{booking.title.replace(/_/g, ' ').toLowerCase()}</h3>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-md",
                        booking.status === "CONFIRMED" ? "bg-indigo-100 text-indigo-700" :
                        booking.status === "PENDING" ? "bg-blue-100 text-blue-700" :
                        booking.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                        {booking.status}
                    </span>
                </div>

                <div className="space-y-2.5 text-sm text-slate-600 mt-2">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-slate-400" />
                        <span>{new Date(booking.startTime).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ({booking.durationMinutes} Menit)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Staff: <strong>{booking.staffName}</strong></span>
                    </div>
                </div>

                {isUpcoming && booking.meetingUrl && (
                    <div className="pt-2">
                        <a 
                            href={booking.meetingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full inline-flex justify-center items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            <Video className="w-4 h-4" />
                            Join Virtual Meeting
                        </a>
                    </div>
                )}
                
                {!isUpcoming && booking.notes && (
                    <div className="pt-3 mt-3 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-500 mb-1">Session Notes:</div>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                            {booking.notes}
                        </p>
                    </div>
                )}
            </div>

            {booking.enrollmentId && booking.type === "BOOKING" && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <Link
                        href={`/client/services/${booking.enrollmentId}`}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors w-full text-center py-1"
                    >
                        Lihat Layanan Terkait
                    </Link>
                </div>
            )}
        </div>
    );
}
