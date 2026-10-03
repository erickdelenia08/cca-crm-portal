"use client";

import { useState } from "react";
import { FileText, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { getMyLeaveRequests, submitLeaveRequest, SubmitLeaveInput } from "@/actions/hr.action";
import { useRouter } from "next/navigation";

type LeaveRequestData = Extract<Awaited<ReturnType<typeof getMyLeaveRequests>>, { data: unknown }>["data"];

interface LeaveClientProps {
    initialRequests: LeaveRequestData;
}

export function LeaveClient({ initialRequests }: LeaveClientProps) {
    const [leaveType, setLeaveType] = useState<SubmitLeaveInput["type"]>("ANNUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const handleLeaveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) {
            alert("Semua field wajib diisi.");
            return;
        }

        setSubmitting(true);
        let attachmentData: Record<string, string | number> = {};

        try {
            if (attachment) {
                // 1. Get presigned URL
                const { getLeaveAttachmentUploadUrl } = await import("@/actions/hr.action");
                const urlRes = await getLeaveAttachmentUploadUrl(attachment.name, attachment.type);
                
                if (!urlRes.success || !urlRes.data) {
                    throw new Error(urlRes.error || "Gagal mendapatkan upload URL");
                }

                // 2. Upload to MinIO
                const uploadRes = await fetch(urlRes.data.uploadUrl, {
                    method: "PUT",
                    body: attachment,
                    headers: {
                        "Content-Type": attachment.type
                    }
                });

                if (!uploadRes.ok) {
                    throw new Error("Gagal mengunggah file ke server storage");
                }

                attachmentData = {
                    attachmentObjectKey: urlRes.data.key,
                    attachmentFileName: attachment.name,
                    attachmentMimeType: attachment.type,
                    attachmentFileSize: attachment.size
                };
            }

            // 3. Submit Leave Request
            const res = await submitLeaveRequest({
                type: leaveType,
                startDate,
                endDate,
                reason,
                ...attachmentData
            });

            if (res.success) {
                alert("Pengajuan izin berhasil dikirim.");
                setStartDate("");
                setEndDate("");
                setReason("");
                setAttachment(null);
                router.refresh();
            } else {
                throw new Error(res.error || "Gagal mengirim pengajuan.");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(errorMessage || "Terjadi kesalahan sistem.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Pengajuan */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
                <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Form Pengajuan
                </h2>
                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Pengajuan</label>
                        <select
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value as SubmitLeaveInput["type"])}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ANNUAL">Cuti Tahunan</option>
                            <option value="SICK">Izin Sakit</option>
                            <option value="PERSONAL">Izin Keperluan Khusus (Personal)</option>
                            <option value="MATERNITY">Cuti Melahirkan</option>
                            <option value="OTHER">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Alasan / Keterangan</label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tuliskan alasan pengajuan secara singkat..."
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500 resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bukti Pendukung (Opsional)</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500 file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold file:px-3 file:py-1 file:rounded-md file:mr-3"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Sertakan surat dokter jika izin sakit.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Send className="w-3.5 h-3.5" /> {submitting ? "Memproses..." : "Kirim Pengajuan"}
                    </button>
                </form>
            </div>

            {/* Riwayat Status Pengajuan */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                    Status Pengajuan Izin / Cuti
                </h2>
                <div className="space-y-3">
                    {initialRequests.map((req) => (
                        <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">{req.type}</span>
                                    <span className="text-xs text-slate-400">•</span>
                                    <span className="text-xs text-slate-600 font-medium">
                                        {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(req.startDate))} s/d{" "}
                                        {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(req.endDate))}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{req.reason}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${req.status === "APPROVED"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : req.status === "REJECTED"
                                            ? "bg-rose-100 text-rose-800"
                                            : "bg-amber-100 text-amber-800"
                                        }`}
                                >
                                    {req.status === "APPROVED" ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="w-3 h-3 text-amber-600" />
                                    )}
                                    {req.status}
                                </span>
                                {req.reviewNote && (
                                    <span className="text-[10px] text-slate-400">Catatan: {req.reviewNote}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {initialRequests.length === 0 && (
                        <div className="p-6 text-center text-slate-500 text-xs">
                            Belum ada riwayat pengajuan izin/cuti.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
