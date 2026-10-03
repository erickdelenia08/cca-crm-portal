import Link from "next/link";
import { getManagementDashboard } from "@/actions/management-portal.action";
import {
    Users,
    TrendingUp,
    FileBarChart,
    Clock,
    UserCheck,
    UserX,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const { success, data, error } = await getManagementDashboard();

    if (!success || !data) {
        return (
            <div className="p-6 text-center text-red-600 mt-20">
                Failed to load dashboard: {error}
            </div>
        );
    }

    const { metrics, documentBottlenecks, todayAttendance, pendingApprovals } = data;

    // Calculate total document sum for percentages
    const totalDocs = documentBottlenecks.reduce((sum: number, item) => sum + item.count, 0);

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard Manajemen
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Ringkasan performa operasional, beban kerja tim, dan persetujuan mendesak.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Update Terakhir: {new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(new Date())}
                </div>
            </div>

            {/* SECTION 1: Metrik Utama (KPI Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white border border-slate-200 rounded-xl shadow-2xs">
                    <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Total Klien Aktif
                            </span>
                            <div className="p-2 rounded-lg border text-blue-600 bg-blue-50 border-blue-200">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalClients}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 rounded-xl shadow-2xs">
                    <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Program Aktif (Enrollments)
                            </span>
                            <div className="p-2 rounded-lg border text-emerald-600 bg-emerald-50 border-emerald-200">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.activeEnrollments}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 2: Grid 2 Kolom (Monitoring Operasional & Presensi Staf) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monitoring Operasional — Bottleneck Analysis (2 Kolom) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <FileBarChart className="w-5 h-5 text-blue-600" />
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Status Dokumen Klien
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Analisis beban kerja pengolahan dokumen
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/processor"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                            Buka Dokumen <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Bar Chart Visual & List Tahap */}
                    <div className="space-y-4 pt-2">
                        {documentBottlenecks.length === 0 ? (
                            <p className="text-sm text-slate-500">Belum ada dokumen.</p>
                        ) : (
                            documentBottlenecks.map((item, idx: number) => {
                                const percentage = totalDocs > 0 ? Math.round((item.count / totalDocs) * 100) : 0;
                                return (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                                {item.stage}
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {item.count} Dokumen ({percentage}%)
                                            </span>
                                        </div>

                                        {/* Progress Bar Visual */}
                                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Ringkasan Presensi Hari Ini (1 Kolom) */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="border-b border-slate-100 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-600" /> Presensi Staf Hari Ini
                            </h2>
                            <p className="text-xs text-slate-500">
                                Total {todayAttendance.totalStaff} Staf Terdaftar
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-4">
                            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                                    <UserCheck className="w-4 h-4 text-emerald-600" /> Hadir Tepat Waktu
                                </div>
                                <span className="text-base font-extrabold text-emerald-900">
                                    {todayAttendance.present}
                                </span>
                            </div>

                            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                                    <Clock className="w-4 h-4 text-amber-600" /> Terlambat
                                </div>
                                <span className="text-base font-extrabold text-amber-900">
                                    {todayAttendance.late}
                                </span>
                            </div>

                            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold">
                                    <UserX className="w-4 h-4 text-blue-600" /> Izin / Cuti
                                </div>
                                <span className="text-base font-extrabold text-blue-900">
                                    {todayAttendance.onLeave}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/management/attendance"
                        className="w-full flex justify-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-colors mt-4"
                    >
                        Lihat Detail Presensi
                    </Link>
                </div>
            </div>

            {/* SECTION 3: Approval Pending (Shortcut Persetujuan) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Persetujuan Cuti & Izin Menunggu
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pengajuan izin dan cuti staf yang membutuhkan keputusan Anda.
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto">
                        {pendingApprovals.length} Pengajuan Pending
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID & Staf</th>
                                <th className="p-4">Jenis Pengajuan</th>
                                <th className="p-4">Durasi</th>
                                <th className="p-4">Alasan</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingApprovals.length > 0 ? (
                                pendingApprovals.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{req.staff.fullName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {req.requestedBy.role} • {req.id.slice(0, 8)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800">
                                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-slate-500 max-w-xs truncate">{req.reason}</td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href="/management/leave"
                                                className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                                            >
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-400 text-xs">
                                        Tidak ada pengajuan yang menunggu persetujuan saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}