"use client";

import { useState } from "react";
import {
    Download,
    FileText,
    DollarSign,
    TrendingUp,
    CreditCard,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ShieldAlert,
} from "lucide-react";

type PayrollItem = {
    id: string;
    month: string;
    year: number;
    period: string;
    paidDate: string;
    baseSalary: number;
    allowance: number;
    incentive: number;
    deduction: number;
    totalNet: number;
    status: "Dibayarkan" | "Proses";
};

export default function PayrollPage() {
    // Mock Data Payroll Konsultan
    const payrollHistory: PayrollItem[] = [
        {
            id: "PAY-2026-08",
            month: "Agustus",
            year: 2026,
            period: "1 Agu 2026 - 28 Agu 2026",
            paidDate: "28 Agustus 2026",
            baseSalary: 8500000,
            allowance: 1500000,
            incentive: 1200000, // Sesi konsultasi tambahan
            deduction: 350000, // BPJS + PPh21
            totalNet: 10850000,
            status: "Dibayarkan",
        },
        {
            id: "PAY-2026-07",
            month: "Juli",
            year: 2026,
            period: "1 Jul 2026 - 31 Jul 2026",
            paidDate: "28 Juli 2026",
            baseSalary: 8500000,
            allowance: 1500000,
            incentive: 800000,
            deduction: 340000,
            totalNet: 10460000,
            status: "Dibayarkan",
        },
        {
            id: "PAY-2026-06",
            month: "Juni",
            year: 2026,
            period: "1 Jun 2026 - 30 Jun 2026",
            paidDate: "28 Juni 2026",
            baseSalary: 8500000,
            allowance: 1500000,
            incentive: 1500000,
            deduction: 360000,
            totalNet: 11140000,
            status: "Dibayarkan",
        },
    ];

    // State Slip Gaji yang sedang dipilih untuk detail
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem>(
        payrollHistory[0]
    );

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDownloadPDF = (payrollId: string) => {
        alert(`Mengunduh Slip Gaji PDF [${payrollId}]...`);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Payroll & Slip Gaji
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Informasi riwayat penghasilan dan rincian komponen gaji bulanan Anda.
                    </p>
                </div>

                {/* Banner Info Read-Only */}
                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                    Tampilan Khusus Mandiri (Read-Only)
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KOLOM KIRI: List Slip Gaji Per Bulan */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">
                        Riwayat Slip Gaji
                    </h2>

                    <div className="space-y-3">
                        {payrollHistory.map((item) => {
                            const isSelected = selectedPayroll.id === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedPayroll(item)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                            ? "bg-blue-50/50 border-blue-500 shadow-2xs"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {item.month} {item.year}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {item.period}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="flex items-end justify-between border-t border-slate-100 pt-3 mt-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                Take-Home Pay
                                            </p>
                                            <p className="text-sm font-extrabold text-blue-600">
                                                {formatIDR(item.totalNet)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadPDF(item.id);
                                            }}
                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors"
                                            title="Unduh PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* KOLOM KANAN: Detail Komponen Gaji (Read-Only) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
                        {/* Header Detail Slip */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                    {selectedPayroll.id}
                                </span>
                                <h2 className="text-lg font-bold text-slate-900 mt-2">
                                    Rincian Gaji — {selectedPayroll.month} {selectedPayroll.year}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tanggal Pembayaran: {selectedPayroll.paidDate}
                                </p>
                            </div>

                            <button
                                onClick={() => handleDownloadPDF(selectedPayroll.id)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
                            >
                                <Download className="w-4 h-4" />
                                Unduh Slip (PDF)
                            </button>
                        </div>

                        {/* Breakdown Komponen Gaji */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Komponen Pendapatan & Potongan
                            </h3>

                            <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200 text-xs">
                                {/* 1. Gaji Pokok */}
                                <div className="flex items-center justify-between p-3.5">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800">Gaji Pokok</p>
                                        <p className="text-[11px] text-slate-500">
                                            Imbalan dasar konsultasi bulanan
                                        </p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {formatIDR(selectedPayroll.baseSalary)}
                                    </span>
                                </div>

                                {/* 2. Tunjangan */}
                                <div className="flex items-center justify-between p-3.5">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800">Tunjangan Operasional</p>
                                        <p className="text-[11px] text-slate-500">
                                            Fasilitas internet & komunikasi
                                        </p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {formatIDR(selectedPayroll.allowance)}
                                    </span>
                                </div>

                                {/* 3. Insentif Sesi */}
                                <div className="flex items-center justify-between p-3.5">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-emerald-800">
                                            Insentif Sesi Konsultasi
                                        </p>
                                        <p className="text-[11px] text-emerald-600">
                                            Bonus performa & klaim kelebihan sesi
                                        </p>
                                    </div>
                                    <span className="font-bold text-emerald-700">
                                        + {formatIDR(selectedPayroll.incentive)}
                                    </span>
                                </div>

                                {/* 4. Potongan */}
                                <div className="flex items-center justify-between p-3.5">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-rose-800">
                                            Potongan (Pajak PPh21 & BPJS)
                                        </p>
                                        <p className="text-[11px] text-rose-600">
                                            Kewajiban pemotongan otomatis
                                        </p>
                                    </div>
                                    <span className="font-bold text-rose-700">
                                        - {formatIDR(selectedPayroll.deduction)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ringkasan Total Bersih */}
                        <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Total Gaji Bersih (Take-Home Pay)
                                </p>
                                <p className="text-2xl font-black text-white mt-1">
                                    {formatIDR(selectedPayroll.totalNet)}
                                </p>
                            </div>

                            <div className="text-xs text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                                <p className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-emerald-400" />
                                    <span>Transfer ke **BCA ****6789**</span>
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Status: Berhasil diproses oleh Finance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}