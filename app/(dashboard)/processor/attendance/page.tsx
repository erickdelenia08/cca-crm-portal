import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Clock } from "lucide-react";
import { AttendanceCard } from "@/components/attendance/attendance-card";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "PROCESSING_DEPARTMENT") {
        redirect("/login");
    }

    const staffProfile = await prisma.staffProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!staffProfile) {
        return (
            <div className="p-6 text-center text-slate-500 mt-20">
                Profil staff tidak ditemukan.
            </div>
        );
    }

    const history = await prisma.attendance.findMany({
        where: { staffId: staffProfile.id },
        orderBy: { date: "desc" },
        take: 30
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Kehadiran</h1>
                <p className="text-sm text-slate-500 mt-1">Kelola jam kerja harian dan riwayat presensi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <AttendanceCard />
                </div>

                <div className="lg:col-span-3">
                    {/* Riwayat Presensi (Table) */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h2 className="text-base font-bold text-slate-900">Riwayat Presensi (30 Hari Terakhir)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Waktu Tap In</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-bold text-slate-900">
                                                {new Intl.DateTimeFormat("id-ID", {
                                                    day: "2-digit", month: "long", year: "numeric"
                                                }).format(new Date(row.date))}
                                            </td>
                                            <td className="p-4">
                                                {row.checkIn ? new Intl.DateTimeFormat("id-ID", {
                                                    hour: "2-digit", minute: "2-digit", timeZoneName: "short"
                                                }).format(new Date(row.checkIn)) : "-"}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        row.status === "ON_TIME" ? "bg-emerald-100 text-emerald-800" :
                                                        row.status === "LATE" ? "bg-amber-100 text-amber-800" :
                                                        "bg-blue-100 text-blue-800"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-slate-500">
                                                Belum ada riwayat presensi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
