"use client";

import { useState } from "react";
import {
    FileSpreadsheet,
    FileText,
    Download,
    Calendar,
    Filter,
    BarChart3,
    Clock,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    FileCheck,
} from "lucide-react";

type ExportFormat = "excel" | "pdf";

export default function AdminReportsPage() {
    // Filter States
    const [dateRange, setDateRange] = useState("this-month");
    const [startDate, setStartDate] = useState("2026-08-01");
    const [endDate, setEndDate] = useState("2026-08-29");

    // Quick Loading State for Feedback
    const [exportingId, setExportingId] = useState<string | null>(null);

    const handleDownloadReport = (reportTitle: string, format: ExportFormat) => {
        const id = `${reportTitle}-${format}`;
        setExportingId(id);

        // Simulate Download Trigger
        setTimeout(() => {
            setExportingId(null);
            alert(`Berhasil mengunduh "${reportTitle}" dalam format ${format.toUpperCase()} (${dateRange})`);
        }, 1200);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Pusat Laporan & Ekspor Data
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Unduh rekapitulasi data presensi, payroll penggajian, dan analitik konversi dalam format XLSX & PDF.
                    </p>
                </div>
            </div>

            {/* Global Filter Baris Periode */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-600" /> Pengaturan Periode Laporan Global
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Rentang Waktu Cepat</label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="this-week">Minggu Ini (24 Agu - 29 Agu 2026)</option>
                            <option value="this-month">Bulan Ini (Agustus 2026)</option>
                            <option value="last-month">Bulan Lalu (Juli 2026)</option>
                            <option value="custom">Rentang Tanggal Kustom</option>
                        </select>
                    </div>

                    {dateRange === "custom" && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Akhir</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Grid Kartu Kategori Laporan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* KATEGORI 1: LAPORAN PRESENSI STAF */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Laporan Presensi</h2>
                                <p className="text-xs text-slate-500">Staf, Pengolah & Konsultan</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Mencakup total jam kerja, akumulasi keterlambatan (menit), izin/sakit/cuti, dan data lembur staf.
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-[11px] text-slate-500">
                            <p className="flex items-center justify-between">
                                <span>Staf Terdaftar:</span> <strong className="text-slate-700">45 Orang</strong>
                            </p>
                            <p className="flex items-center justify-between">
                                <span>Rata-rata Kehadiran:</span> <strong className="text-emerald-600">96.4%</strong>
                            </p>
                        </div>
                    </div>

                    {/* Tombol Ekspor */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => handleDownloadReport("Laporan Presensi Staf", "excel")}
                            disabled={exportingId === "Laporan Presensi Staf-excel"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            {exportingId === "Laporan Presensi Staf-excel" ? "Mengunduh..." : "Ekspor Excel (.xlsx)"}
                        </button>
                        <button
                            onClick={() => handleDownloadReport("Laporan Presensi Staf", "pdf")}
                            disabled={exportingId === "Laporan Presensi Staf-pdf"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            {exportingId === "Laporan Presensi Staf-pdf" ? "Mengunduh..." : "Ekspor PDF Ringkasan"}
                        </button>
                    </div>
                </div>

                {/* KATEGORI 2: LAPORAN PAYROLL & GAJI */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Laporan Payroll</h2>
                                <p className="text-xs text-slate-500">Penggajian & Insentif Sesi</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Rincian gaji pokok, bonus insentif per sesi terlaksana, tunjangan jabatan, dan kalkulasi potongan absensi.
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-[11px] text-slate-500">
                            <p className="flex items-center justify-between">
                                <span>Total Budget Payroll:</span> <strong className="text-slate-700">Rp 142.500.000</strong>
                            </p>
                            <p className="flex items-center justify-between">
                                <span>Status Verifikasi:</span> <strong className="text-blue-600">Terverifikasi</strong>
                            </p>
                        </div>
                    </div>

                    {/* Tombol Ekspor */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => handleDownloadReport("Laporan Payroll Penggajian", "excel")}
                            disabled={exportingId === "Laporan Payroll Penggajian-excel"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            {exportingId === "Laporan Payroll Penggajian-excel" ? "Mengunduh..." : "Ekspor Excel (.xlsx)"}
                        </button>
                        <button
                            onClick={() => handleDownloadReport("Laporan Payroll Penggajian", "pdf")}
                            disabled={exportingId === "Laporan Payroll Penggajian-pdf"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            {exportingId === "Laporan Payroll Penggajian-pdf" ? "Mengunduh..." : "Ekspor PDF Rekapitulasi"}
                        </button>
                    </div>
                </div>

                {/* KATEGORI 3: LAPORAN ANALYTICS & KONVERSI */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Analitik & Konversi</h2>
                                <p className="text-xs text-slate-500">Performa Leads & Calon Siswa</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Statistik tingkat konversi pendaftaran calon siswa, efektivitas konseling, dan bottleneck berkas dokumen.
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-[11px] text-slate-500">
                            <p className="flex items-center justify-between">
                                <span>Tingkat Konversi:</span> <strong className="text-emerald-600">68.4%</strong>
                            </p>
                            <p className="flex items-center justify-between">
                                <span>Total Siswa Baru:</span> <strong className="text-slate-700">1,248 Siswa</strong>
                            </p>
                        </div>
                    </div>

                    {/* Tombol Ekspor */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => handleDownloadReport("Laporan Analitik Konversi", "excel")}
                            disabled={exportingId === "Laporan Analitik Konversi-excel"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            {exportingId === "Laporan Analitik Konversi-excel" ? "Mengunduh..." : "Ekspor Excel Raw Data"}
                        </button>
                        <button
                            onClick={() => handleDownloadReport("Laporan Analitik Konversi", "pdf")}
                            disabled={exportingId === "Laporan Analitik Konversi-pdf"}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            {exportingId === "Laporan Analitik Konversi-pdf" ? "Mengunduh..." : "Ekspor Executive Summary PDF"}
                        </button>
                    </div>
                </div>

            </div>

            {/* Tabel Riwayat Unduhan Laporan Terakhir */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Riwayat Unduhan Laporan Terakhir</h2>
                    <p className="text-xs text-slate-500">Daftar laporan yang telah di-generate oleh akun manajemen Anda.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Nama Laporan</th>
                                <th className="p-4">Format</th>
                                <th className="p-4">Periode Data</th>
                                <th className="p-4">Waktu Generate</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">Laporan Presensi Staf_Agustus_2026.xlsx</td>
                                <td className="p-4">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        EXCEL
                                    </span>
                                </td>
                                <td className="p-4 text-slate-700 font-medium">01 Agu - 29 Agu 2026</td>
                                <td className="p-4 text-slate-400">29 Agu 2026, 07:30 WIB</td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> Unduh Ulang
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">Summary_Payroll_Agustus_2026.pdf</td>
                                <td className="p-4">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                        PDF
                                    </span>
                                </td>
                                <td className="p-4 text-slate-700 font-medium">01 Agu - 28 Agu 2026</td>
                                <td className="p-4 text-slate-400">28 Agu 2026, 16:45 WIB</td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> Unduh Ulang
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}