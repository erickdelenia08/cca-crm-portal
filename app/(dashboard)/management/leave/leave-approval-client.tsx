"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, ExternalLink, Download } from "lucide-react";
import { updateLeaveRequestStatus } from "@/actions/hr-management.action";
import { getLeaveAttachmentDownloadUrl } from "@/actions/hr.action";
import { useRouter } from "next/navigation";

interface LeaveApprovalClientProps {
    initialRequests: any[];
}

export function LeaveApprovalClient({ initialRequests }: LeaveApprovalClientProps) {
    const [submitting, setSubmitting] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
        let note = "";
        if (status === "REJECTED") {
            const input = prompt("Masukkan alasan penolakan:");
            if (input === null) return;
            note = input;
        } else {
            const input = prompt("Tambahkan catatan persetujuan (opsional):");
            if (input !== null) {
                note = input;
            } else {
                return;
            }
        }

        setSubmitting(id);
        const res = await updateLeaveRequestStatus(id, status, note);
        setSubmitting(null);

        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || "Gagal memproses persetujuan.");
        }
    };

    const handleDownload = async (id: string) => {
        try {
            const res = await getLeaveAttachmentDownloadUrl(id);
            if (res.success && res.data) {
                window.open(res.data, "_blank");
            } else {
                alert(res.error || "Gagal mendapatkan link download.");
            }
        } catch (error: any) {
            alert(error.message || "Terjadi kesalahan sistem.");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Karyawan</th>
                            <th className="p-4">Jenis</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Alasan</th>
                            <th className="p-4">Bukti</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {initialRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{req.staff?.fullName || "Karyawan"}</p>
                                    <p className="text-[10px] text-slate-500">{req.requestedBy?.role}</p>
                                </td>
                                <td className="p-4 font-bold text-slate-800">{req.type}</td>
                                <td className="p-4 whitespace-nowrap">
                                    {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(req.startDate))}
                                    <br />
                                    <span className="text-[10px] text-slate-400">s/d</span>
                                    <br />
                                    {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(req.endDate))}
                                </td>
                                <td className="p-4 max-w-xs truncate">{req.reason}</td>
                                <td className="p-4">
                                    {req.attachmentObjectKey ? (
                                        <button 
                                            onClick={() => handleDownload(req.id)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-[10px] transition-colors"
                                        >
                                            <Download className="w-3 h-3" /> Unduh
                                        </button>
                                    ) : "-"}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                            req.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" :
                                            req.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                                            "bg-amber-100 text-amber-800"
                                        }`}
                                    >
                                        {req.status === "APPROVED" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {req.status === "PENDING" ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(req.id, "APPROVED")}
                                                disabled={submitting === req.id}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs disabled:opacity-50"
                                            >
                                                Setujui
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, "REJECTED")}
                                                disabled={submitting === req.id}
                                                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg text-xs disabled:opacity-50"
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-500">Selesai</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {initialRequests.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-500">
                                    Belum ada pengajuan izin/cuti.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
