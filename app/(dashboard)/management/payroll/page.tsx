"use client";

import { useState } from "react";
import {
    Calculator,
    DollarSign,
    FileSpreadsheet,
    FileText,
    Send,
    Lock,
    History,
    Settings,
    Search,
    CheckCircle2,
    Clock,
    Eye,
    Download,
    X,
    Plus,
    Trash2,
    Sparkles,
} from "lucide-react";

// Tipe Data Payroll
type PayrollRecord = {
    id: string;
    staffId: string;
    name: string;
    role: string;
    baseSalary: number;
    incentives: number; // Dari total sesi
    allowances: number;
    deductions: number; // Dari terlambat/absen
    totalSessions: number;
    netSalary: number;
    status: "Draft" | "Calculated" | "Distributed";
    distributedAt?: string;
};

export default function AdminPayrollPage() {
    const [activeTab, setActiveTab] = useState<
        "kalkulasi" | "komponen" | "riwayat" | "distribusi"
    >("kalkulasi");

    // Mock Data Payroll Staf & Konsultan
    const [payrolls, setPayrolls] = useState<PayrollRecord[]>([
        {
            id: "PAY-2026-0801",
            staffId: "USR-101",
            name: "Budi Santoso",
            role: "Konsultan Senior",
            baseSalary: 6000000,
            incentives: 2400000, // 16 Sesi x Rp 150.000
            allowances: 500000,
            deductions: 0,
            totalSessions: 16,
            netSalary: 8900000,
            status: "Calculated",
        },
        {
            id: "PAY-2026-0802",
            staffId: "USR-102",
            name: "Dewi Lestari",
            role: "Tim Pengolah",
            baseSalary: 5000000,
            incentives: 0,
            allowances: 300000,
            deductions: 100000, // Potongan keterlambatan
            totalSessions: 0,
            netSalary: 5200000,
            status: "Distributed",
            distributedAt: "28 Agu 2026 15:30 WIB",
        },
    ]);

    // Modal State Slip Gaji
    const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Handler Trigger Kalkulasi Otomatis
    const handleCalculatePayroll = () => {
        alert("Memproses kalkulasi otomatis berdasarkan data presensi & sesi terlaksana...");
        setPayrolls((prev) =>
            prev.map((item) => ({ ...item, status: "Calculated" as const }))
        );
    };

    // Handler Kirim Massal Terenkripsi
    const handleDistributeAll = () => {
        const timestamp = new Date().toLocaleString("id-ID") + " WIB";
        setPayrolls((prev) =>
            prev.map((item) => ({
                ...item,
                status: "Distributed" as const,
                distributedAt: timestamp,
            }))
        );
        alert("Slip gaji terenkripsi berhasil dikirimkan massal ke portal masing-masing staf!");
    };

    const formatIDR = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Penggajian & Gaji (Payroll Oversight)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Konfigurasi komponen gaji, kalkulasi otomatis presensi/sesi, dan distribusi slip terenkripsi.
                    </p>
                </div>

                {/* Global Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={handleCalculatePayroll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                        <Sparkles className="w-4 h-4" /> Trigger Kalkulasi Otomatis
                    </button>
                    <button
                        onClick={handleDistributeAll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                        <Send className="w-4 h-4 text-emerald-400" /> Distribusi Massal
                    </button>
                </div>
            </div>

            {/* Metric Cards Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran Gaji</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {formatIDR(payrolls.reduce((acc, curr) => acc + curr.netSalary, 0))}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Periode: Agustus 2026</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sesi Terinsentif</p>
                    <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                        {payrolls.reduce((acc, curr) => acc + curr.totalSessions, 0)} Sesi
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Kalkulasi presensi aktif</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Distribusi Slip</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                        {payrolls.filter((p) => p.status === "Distributed").length} / {payrolls.length} Terkirim
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Terenkripsi ke portal staf</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4">
                <button
                    onClick={() => setActiveTab("kalkulasi")}
                    className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "kalkulasi"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <Calculator className="w-4 h-4" /> Kalkulasi & Preview Gaji
                </button>
                <button
                    onClick={() => setActiveTab("komponen")}
                    className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "komponen"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <Settings className="w-4 h-4" /> Konfigurasi Komponen
                </button>
                <button
                    onClick={() => setActiveTab("riwayat")}
                    className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "riwayat"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <History className="w-4 h-4" /> Riwayat Slip Diterbitkan
                </button>
            </div>

            {/* TAB 1: KALKULASI & PREVIEW GAJI */}
            {activeTab === "kalkulasi" && (
                <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Staf & Peran</th>
                                        <th className="p-4">Gaji Pokok</th>
                                        <th className="p-4">Insentif Sesi</th>
                                        <th className="p-4">Tunjangan</th>
                                        <th className="p-4">Potongan</th>
                                        <th className="p-4">Total Gaji Bersih</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payrolls.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-slate-900">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{p.role}</p>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-800">{formatIDR(p.baseSalary)}</td>
                                            <td className="p-4">
                                                <p className="font-semibold text-blue-600">{formatIDR(p.incentives)}</p>
                                                <p className="text-[10px] text-slate-400">{p.totalSessions} Sesi Terlaksana</p>
                                            </td>
                                            <td className="p-4 text-emerald-600 font-semibold">{formatIDR(p.allowances)}</td>
                                            <td className="p-4 text-rose-600 font-semibold">-{formatIDR(p.deductions)}</td>
                                            <td className="p-4 font-extrabold text-slate-900 text-sm">{formatIDR(p.netSalary)}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => setSelectedPayslip(p)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Preview Slip PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: KONFIGURASI KOMPONEN GAJI */}
            {activeTab === "komponen" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900">Konfigurasi Komponen Gaji per Staf/Konsultan</h2>
                        <p className="text-xs text-slate-500">Atur nominal pokok, insentif per sesi, tunjangan, dan kalkulasi potongan otomatis.</p>
                    </div>

                    <div className="space-y-4">
                        {payrolls.map((p) => (
                            <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-900 text-sm">{p.name} ({p.role})</span>
                                    <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                                        <Plus className="w-3.5 h-3.5" /> Tambah Komponen Khusus
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                                    <div>
                                        <label className="block text-slate-500 font-semibold mb-1">Gaji Pokok (Rp)</label>
                                        <input type="number" defaultValue={p.baseSalary} className="w-full border border-slate-300 rounded-lg p-2 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-semibold mb-1">Tarif Insentif/Sesi (Rp)</label>
                                        <input type="number" defaultValue={150000} className="w-full border border-slate-300 rounded-lg p-2 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-semibold mb-1">Tunjangan Jabatan (Rp)</label>
                                        <input type="number" defaultValue={p.allowances} className="w-full border border-slate-300 rounded-lg p-2 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-semibold mb-1">Potongan Per-Terlambat (Rp)</label>
                                        <input type="number" defaultValue={50000} className="w-full border border-slate-300 rounded-lg p-2 bg-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: RIWAYAT SLIP GAJI */}
            {activeTab === "riwayat" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900">Riwayat Slip Gaji Terbit</h2>
                        <p className="text-xs text-slate-500">Arsip dokumen slip gaji terenkripsi yang telah dikirim ke staf.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID Slip</th>
                                    <th className="p-4">Nama Staf</th>
                                    <th className="p-4">Waktu Distribusi</th>
                                    <th className="p-4">Enkripsi</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payrolls.filter(p => p.status === "Distributed").map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{p.id}</td>
                                        <td className="p-4 font-semibold text-slate-800">{p.name}</td>
                                        <td className="p-4 text-slate-500">{p.distributedAt}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                <Lock className="w-3 h-3" /> Encrypted (AES-256)
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                                                <Download className="w-3.5 h-3.5" /> Unduh PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL / DRAWER: GENERATOR & PREVIEW SLIP GAJI PDF */}
            {selectedPayslip && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden space-y-4">
                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <h3 className="font-bold text-sm">Preview Slip Gaji (PDF View)</h3>
                            </div>
                            <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Template PDF Preview */}
                        <div className="p-6 space-y-4 text-xs font-mono bg-slate-50 border border-slate-200 mx-4 rounded-xl">
                            <div className="text-center border-b border-slate-300 pb-3">
                                <h2 className="font-bold text-base text-slate-900">SLIP GAJI KARYAWAN</h2>
                                <p className="text-[10px] text-slate-500">Periode: Agustus 2026 • Ref: {selectedPayslip.id}</p>
                            </div>

                            <div className="flex justify-between text-slate-700">
                                <div>
                                    <p>Nama: <strong>{selectedPayslip.name}</strong></p>
                                    <p>ID: {selectedPayslip.staffId}</p>
                                </div>
                                <div className="text-right">
                                    <p>Jabatan: {selectedPayslip.role}</p>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-slate-200">
                                <div className="flex justify-between text-slate-600">
                                    <span>Gaji Pokok</span>
                                    <span>{formatIDR(selectedPayslip.baseSalary)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Insentif Sesi ({selectedPayslip.totalSessions} Sesi)</span>
                                    <span>{formatIDR(selectedPayslip.incentives)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Tunjangan</span>
                                    <span>{formatIDR(selectedPayslip.allowances)}</span>
                                </div>
                                <div className="flex justify-between text-rose-600">
                                    <span>Potongan Keterlambatan</span>
                                    <span>-{formatIDR(selectedPayslip.deductions)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between border-t border-slate-400 pt-2 font-bold text-slate-900 text-sm">
                                <span>TOTAL DITERIMA (NET)</span>
                                <span>{formatIDR(selectedPayslip.netSalary)}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedPayslip(null)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => alert(`Mengunduh Slip Gaji ${selectedPayslip.id} sebagai PDF...`)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}