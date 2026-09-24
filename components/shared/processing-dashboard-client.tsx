"use client";

import { useRouter } from "next/navigation";
import {
    Clock,
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    FileUp,
    Search,
    XCircle,
    ChevronRight,
    User,
    ShieldAlert,
} from "lucide-react";

type DocumentStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW" | "APPROVED"
    | "REJECTED"
    | "REVISION_REQUIRED";

interface PriorityDocument {
    id: string;
    student: { fullName: string };
    requirement: { name: string };
    status: DocumentStatus;
    updatedAt: Date;
    reviewedBy?: { fullName: string } | null;
}

interface ProcessingDashboardClientProps {
    counts: Record<DocumentStatus, number>;
    priorityDocuments: PriorityDocument[];
    lastUpdated: Date;
}

export function ProcessingDashboardClient({
    counts,
    priorityDocuments,
    lastUpdated,
}: ProcessingDashboardClientProps) {
    const router = useRouter();

    const statusSummary = [
        {
            id: "SUBMITTED",
            label: "Uploaded",
            count: counts.SUBMITTED || 0,
            desc: "Dokumen baru masuk",
            icon: FileUp,
            accentColor: "bg-blue-500",
            badgeStyle: "bg-blue-50 text-blue-700 border-blue-100",
        },
        {
            id: "UNDER_REVIEW",
            label: "Under Review",
            count: counts.UNDER_REVIEW || 0,
            desc: "Sedang diproses admin",
            icon: Search,
            accentColor: "bg-amber-500",
            badgeStyle: "bg-amber-50 text-amber-700 border-amber-100",
        },
        {
            id: "REVISION_REQUIRED",
            label: "Needs Revision",
            count: counts.REVISION_REQUIRED || 0,
            desc: "Menunggu perbaikan",
            icon: AlertTriangle,
            accentColor: "bg-orange-500",
            badgeStyle: "bg-orange-50 text-orange-700 border-orange-100",
        },
        {
            id: "REJECTED",
            label: "Rejected",
            count: counts.REJECTED || 0,
            desc: "Dokumen ditolak",
            icon: XCircle,
            accentColor: "bg-rose-500",
            badgeStyle: "bg-rose-50 text-rose-700 border-rose-100",
        },
        {
            id: "APPROVED",
            label: "Approved",
            count: counts.APPROVED || 0,
            desc: "Selesai disetujui",
            icon: CheckCircle2,
            accentColor: "bg-emerald-500",
            badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-100",
        },
    ];

    const handleFilterClick = (statusId: string) => {
        router.push(`/processor/documents?status=${encodeURIComponent(statusId)}`);
    };

    const calculateWaitingDays = (updatedAt: Date) => {
        const diffTime = Math.abs(new Date().getTime() - new Date(updatedAt).getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusBadge = (status: DocumentStatus) => {
        switch (status) {
            case "SUBMITTED":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">Uploaded</span>;
            case "UNDER_REVIEW":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">Under Review</span>;
            case "REVISION_REQUIRED":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-100">Needs Revision</span>;
            case "APPROVED":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Approved</span>;
            case "REJECTED":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">Rejected</span>;
            default:
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-100">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto text-slate-900">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                        Dashboard Tim Pengolah
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                        Pantau ringkasan beban kerja harian dan kelola antrean dokumen secara efisien.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/80 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                        Update:{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(new Date(lastUpdated))}{" "}
                        WIB
                    </span>
                </div>
            </div>

            {/* Ringkasan Status Cards */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Ringkasan Status Dokumen
                    </h2>
                    <span className="text-[11px] text-slate-400">Klik kartu untuk memfilter</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {statusSummary.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleFilterClick(item.id)}
                                className="group relative p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.accentColor}`} />
                                            <span className="text-xs font-medium text-slate-600">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </div>

                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-semibold tracking-tight text-slate-900">
                                            {item.count}
                                        </span>
                                        <span className="text-xs text-slate-400 font-normal">
                                            dokumen
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-50">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Table Section: Antrian Prioritas */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600 border border-rose-100/80 shrink-0">
                            <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Antrean Prioritas
                                </h2>
                                <span className="text-[11px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-100">
                                    Tertahan &gt; 3 Hari
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Dokumen yang membutuhkan tindakan segera untuk mencegah hambatan proses.
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
                        <strong className="text-slate-900 font-semibold">{priorityDocuments.length}</strong> Perlu Atensi
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50/60 border-b border-slate-100 font-medium text-slate-500">
                            <tr>
                                <th className="py-3 px-4 font-semibold">ID</th>
                                <th className="py-3 px-4 font-semibold">Siswa</th>
                                <th className="py-3 px-4 font-semibold">Dokumen</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Lama Menunggu</th>
                                <th className="py-3 px-4 font-semibold">PIC Admin</th>
                                <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {priorityDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <CheckCircle2 className="w-8 h-8 text-slate-200" />
                                            <p className="text-xs font-medium text-slate-600">Semua aman!</p>
                                            <p className="text-[11px] text-slate-400">Tidak ada antrean tertahan saat ini.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                priorityDocuments.map((doc) => {
                                    const waitingDays = calculateWaitingDays(doc.updatedAt);
                                    return (
                                        <tr
                                            key={doc.id}
                                            className="hover:bg-slate-50/70 transition-colors group"
                                        >
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                                                #{doc.id}
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-slate-900">
                                                {doc.student.fullName}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {doc.requirement.name}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {getStatusBadge(doc.status)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium text-[11px]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                    {waitingDays} Hari
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200/60">
                                                        {doc.reviewedBy?.fullName ? doc.reviewedBy.fullName.charAt(0) : <User className="w-2.5 h-2.5 text-slate-400" />}
                                                    </div>
                                                    <span>{doc.reviewedBy?.fullName || "Unassigned"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/processor/documents?search=${encodeURIComponent(doc.id)}`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                                                >
                                                    <span>Proses</span>
                                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}