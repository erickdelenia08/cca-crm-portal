import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AttendanceClient } from "./attendance-client";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
        redirect("/login");
    }

    const now = new Date();
    const jakartaString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    const jakartaDate = new Date(jakartaString);
    
    const startOfDay = new Date(jakartaDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(jakartaDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await prisma.attendance.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        include: {
            staff: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            checkIn: "desc"
        }
    });

    const formattedData = attendances.map(a => ({
        id: a.id,
        name: a.staff.fullName,
        role: a.staff.user.role,
        department: a.staff.department,
        checkIn: a.checkIn,
        status: a.status
    }));

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Presensi Karyawan
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Rekap kehadiran karyawan hari ini.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs (Single Tab Conceptually) */}
            <div className="flex border-b border-slate-200 gap-4">
                <button
                    className="pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 border-blue-600 text-blue-600"
                >
                    <Clock className="w-4 h-4" /> Presensi Hari Ini
                </button>
            </div>

            <AttendanceClient initialData={formattedData} />
        </div>
    );
}