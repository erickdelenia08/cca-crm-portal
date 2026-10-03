"use client";

import { useState } from "react";
import {
    Calculator,
    History,
    Settings,
    Download,
    Eye,
    X,
    Sparkles,
    AlertTriangle,
} from "lucide-react";

type PayslipRecord = {
    id: string;
    staffId: string;
    name: string;
    role: string;
    periodStart: string;
    periodEnd: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    pdfUrl: string | null;
    createdAt: string;
};

type ActiveStaff = {
    id: string;
    fullName: string;
    position: string | null;
    department: string | null;
    employeeNumber: string | null;
};

export function PayrollClient({ initialPayslips, activeStaff }: { initialPayslips: PayslipRecord[], activeStaff: ActiveStaff[] }) {
    const [activeTab, setActiveTab] = useState<"kalkulasi" | "komponen" | "riwayat">("riwayat");
    const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);

    const formatIDR = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const handleCalculatePayroll = () => {
        alert("PERHATIAN: Kalkulasi Payroll Otomatis saat ini ditangguhkan.\n\nAturan bisnis mengenai Base Salary, Tarif Sesi Mengajar/Konsultasi, Tunjangan, dan Formula Potongan belum didefinisikan dalam database. Mohon lengkapi Business Rules terlebih dahulu.");
    };

    return (
        <div className="space-y-8 p-8 md:p-12 max-w-7xl mx-auto font-sans selection:bg-[#3b82f6] selection:text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#e2e8f0]">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                        Payroll Administration
                    </h1>
                    <p className="text-[15px] font-normal text-[#475569]">
                        Manage payroll processing, auto-calculation, and PDF distribution.
                    </p>
                </div>

                {/* Global Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCalculatePayroll}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-bold rounded-full transition-colors shadow-sm hover:shadow-md"
                    >
                        <Sparkles className="w-4 h-4" /> Calculate Payroll (Draft)
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e2e8f0] gap-8">
                <button
                    onClick={() => setActiveTab("riwayat")}
                    className={`pb-4 text-[14px] font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === "riwayat"
                        ? "border-[#3b82f6] text-[#3b82f6]"
                        : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                        }`}
                >
                    <History className="w-4 h-4" /> Finalized Payslips
                </button>
                <button
                    onClick={() => setActiveTab("kalkulasi")}
                    className={`pb-4 text-[14px] font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === "kalkulasi"
                        ? "border-[#3b82f6] text-[#3b82f6]"
                        : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                        }`}
                >
                    <Calculator className="w-4 h-4" /> Generate
                </button>
                <button
                    onClick={() => setActiveTab("komponen")}
                    className={`pb-4 text-[14px] font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === "komponen"
                        ? "border-[#3b82f6] text-[#3b82f6]"
                        : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                        }`}
                >
                    <Settings className="w-4 h-4" /> Active Staff
                </button>
            </div>

            {/* TAB 1: RIWAYAT SLIP GAJI */}
            {activeTab === "riwayat" && (
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#f1f5f9]">
                        <h2 className="text-xl font-bold text-[#0f172a]">Finalized Payslips</h2>
                        <p className="text-[14px] text-[#64748b] mt-1">A record of all generated payslips saved in the database.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px]">
                            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                                <tr>
                                    <th className="p-4 pl-6 font-bold text-[#475569] uppercase tracking-wider text-[11px]">Release Date</th>
                                    <th className="p-4 font-bold text-[#475569] uppercase tracking-wider text-[11px]">Staff Member</th>
                                    <th className="p-4 font-bold text-[#475569] uppercase tracking-wider text-[11px]">Base Salary</th>
                                    <th className="p-4 font-bold text-[#475569] uppercase tracking-wider text-[11px]">Net Salary</th>
                                    <th className="p-4 pr-6 text-right font-bold text-[#475569] uppercase tracking-wider text-[11px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {initialPayslips.length > 0 ? initialPayslips.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors group">
                                        <td className="p-4 pl-6 font-semibold text-[#0f172a]">
                                            {new Date(p.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-[#0f172a] text-[15px]">{p.name}</p>
                                            <p className="text-[12px] font-medium text-[#64748b] mt-0.5">{p.role}</p>
                                        </td>
                                        <td className="p-4 font-medium text-[#475569]">{formatIDR(p.baseSalary)}</td>
                                        <td className="p-4 font-bold text-[#0f172a]">{formatIDR(p.netSalary)}</td>
                                        <td className="p-4 pr-6 text-right">
                                            <button 
                                                onClick={() => setSelectedPayslip(p)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#3b82f6] hover:bg-[#e0f2fe] transition-colors mr-2"
                                            >
                                                <Eye className="w-4 h-4" /> View
                                            </button>
                                            {p.pdfUrl && (
                                                <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#475569] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors">
                                                    <Download className="w-4 h-4" /> PDF
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[#94a3b8] font-medium">
                                            No finalized payslips found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: KALKULASI PENDING */}
            {activeTab === "kalkulasi" && (
                <div className="bg-white border border-rose-200 rounded-xl p-8 shadow-2xs text-center space-y-4">
                     <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <h2 className="text-lg font-bold text-slate-900">Modul Kalkulasi Memerlukan Konfigurasi Bisnis</h2>
                     <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                        Berdasarkan hasil audit arsitektur database CRM, sistem belum memiliki tabel atau relasi untuk menyimpan <strong>Konfigurasi Gaji Pokok (Base Salary)</strong>, <strong>Tarif Mengajar/Konsultasi</strong>, maupun <strong>Formula Potongan/Insentif</strong> untuk setiap profil staf.
                     </p>
                     <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                        Oleh karena itu, kalkulasi Payroll Otomatis saat ini ditangguhkan agar tidak menggenerasi angka finansial yang tidak akurat. Silakan hubungi tim analis bisnis untuk menetapkan struktur kompensasi sebelum mengaktifkan fitur ini.
                     </p>
                </div>
            )}

            {/* TAB 3: DATA KARYAWAN */}
            {activeTab === "komponen" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900">Daftar Karyawan Aktif</h2>
                        <p className="text-xs text-slate-500">Daftar profil staf yang terdaftar dalam sistem (StaffProfile).</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID Staf</th>
                                    <th className="p-4">Nama Lengkap</th>
                                    <th className="p-4">Posisi & Departemen</th>
                                    <th className="p-4 text-center">Status Konfigurasi Gaji</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activeStaff.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-mono text-[10px] text-slate-500">{staff.employeeNumber || staff.id.substring(0,8)}</td>
                                        <td className="p-4 font-bold text-slate-900">{staff.fullName}</td>
                                        <td className="p-4">{staff.position || "-"} ({staff.department || "-"})</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                Belum Dikonfigurasi
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL PREVIEW */}
            {selectedPayslip && (
                <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 bg-[#0f172a] text-white flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-[15px] tracking-tight">Payslip Preview</h3>
                            <button onClick={() => setSelectedPayslip(null)} className="text-[#94a3b8] hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <div className="space-y-6 text-[14px] font-mono bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-xl text-[#0f172a]">
                                <div className="text-center border-b border-[#cbd5e1] pb-4">
                                    <h2 className="font-bold text-lg tracking-wider">PAYSLIP RECORD</h2>
                                    <p className="text-[12px] text-[#64748b] mt-1 uppercase">Period: {new Date(selectedPayslip.periodStart).toLocaleDateString("en-US")} - {new Date(selectedPayslip.periodEnd).toLocaleDateString("en-US")}</p>
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-[#64748b]">Name: <strong className="text-[#0f172a]">{selectedPayslip.name}</strong></p>
                                        <p className="text-[#64748b]">ID: <span className="text-[#0f172a]">{selectedPayslip.staffId.substring(0,8)}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#64748b]">Role: <span className="text-[#0f172a]">{selectedPayslip.role}</span></p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-[#e2e8f0]">
                                    <div className="flex justify-between">
                                        <span className="text-[#475569]">Base Salary</span>
                                        <span className="font-medium">{formatIDR(selectedPayslip.baseSalary)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#475569]">Total Allowances</span>
                                        <span className="font-medium">{formatIDR(selectedPayslip.allowances)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#ef4444]">
                                        <span>Total Deductions</span>
                                        <span className="font-medium">-{formatIDR(selectedPayslip.deductions)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t-2 border-[#94a3b8] pt-4 font-bold text-base">
                                    <span>NET AMOUNT</span>
                                    <span>{formatIDR(selectedPayslip.netSalary)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] flex justify-end shrink-0">
                            <button
                                onClick={() => setSelectedPayslip(null)}
                                className="px-6 py-2.5 border border-[#cbd5e1] rounded-full text-[14px] font-bold text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
