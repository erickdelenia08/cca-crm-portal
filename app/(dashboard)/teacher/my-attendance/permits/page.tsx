"use client";

import { useState } from "react";
import {
    Calendar,
    Upload,
    Send,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Plus,
    X,
    ExternalLink
} from "lucide-react";

interface LeaveHistory {
    id: string;
    type: "SAKIT" | "IZIN" | "CUTI";
    startDate: string;
    endDate: string;
    reason: string;
    proofUrl?: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
}

export default function LeaveRequestPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    // Form State
    const [leaveType, setLeaveType] = useState("SAKIT");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const [history, setHistory] = useState<LeaveHistory[]>([
        {
            id: "perm-1",
            type: "SAKIT",
            startDate: "2026-09-10",
            endDate: "2026-09-11",
            reason: "Demam tinggi dan butuh istirahat sesuai anjuran dokter.",
            proofUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
            status: "PENDING",
            submittedAt: "2026-09-09",
        },
        {
            id: "perm-2",
            type: "IZIN",
            startDate: "2026-08-15",
            endDate: "2026-08-15",
            reason: "Mengurus perpanjangan dokumen pribadi di dinas terkait.",
            status: "APPROVED",
            submittedAt: "2026-08-12",
        },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRequest: LeaveHistory = {
            id: `perm-${Date.now()}`,
            type: leaveType as "SAKIT" | "IZIN" | "CUTI",
            startDate,
            endDate,
            reason,
            status: "PENDING",
            submittedAt: new Date().toISOString().split("T")[0],
        };

        setHistory([newRequest, ...history]);
        setIsModalOpen(false);
        // Reset Form
        setReason("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengajuan Izin & Cuti</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola dan ajukan permohonan ketidakhadiran pribadi Anda.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-2xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>Buat Pengajuan Baru</span>
                </button>
            </div>

            {/* Tabel Riwayat Pengajuan */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">Riwayat Pengajuan Saya</h2>
                    <span className="text-xs text-slate-500 font-medium">{history.length} Total Pengajuan</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Tipe</th>
                                <th className="px-6 py-3">Tanggal Pelaksanaan</th>
                                <th className="px-6 py-3">Alasan</th>
                                <th className="px-6 py-3 text-center">Bukti Lampiran</th>
                                <th className="px-6 py-3 text-center">Status Approval</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${item.type === "SAKIT"
                                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                : item.type === "IZIN"
                                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                    : "bg-purple-50 text-purple-700 border border-purple-200"
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 font-mono text-xs text-slate-800 font-semibold">
                                        {item.startDate === item.endDate ? item.startDate : `${item.startDate} s/d ${item.endDate}`}
                                    </td>

                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-xs text-slate-600 line-clamp-2 font-medium">{item.reason}</p>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {item.proofUrl ? (
                                            <button
                                                onClick={() => setSelectedProof(item.proofUrl || null)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                                            >
                                                <FileText className="w-3.5 h-3.5" /> Lihat Lampiran
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">-</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.status === "PENDING"
                                                ? "bg-amber-100 text-amber-800"
                                                : item.status === "APPROVED"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-rose-100 text-rose-800"
                                            }`}>
                                            {item.status === "PENDING" && <Clock className="w-3 h-3" />}
                                            {item.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                                            {item.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: Form Tambah Pengajuan */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-4">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-900">Form Pengajuan Izin / Cuti</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Pengajuan</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                                >
                                    <option value="SAKIT">Sakit (Butuh Surat Dokter)</option>
                                    <option value="IZIN">Izin Keperluan Pribadi</option>
                                    <option value="CUTI">Cuti Tahunan</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Alasan / Detail Ketidakhadiran</label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Tuliskan keterangan lengkap..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Unggah Lampiran Bukti</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                    <span className="text-xs font-medium text-slate-600">Klik untuk upload Surat Dokter / Foto</span>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                                >
                                    <Send className="w-3.5 h-3.5" /> Kirim Pengajuan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: View Preview Document */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-4">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-900">Dokumen Lampiran</h3>
                            <button onClick={() => setSelectedProof(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-center bg-slate-100 max-h-80 overflow-hidden rounded-xl mx-4 border border-slate-200">
                            <img src={selectedProof} alt="Bukti Lampiran" className="object-cover w-full h-full" />
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}