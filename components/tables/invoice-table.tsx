"use client";

import React, { useState } from "react";
import { Search, Plus, CheckCircle2, Clock, AlertCircle, Eye, CreditCard, FileText, X, Printer, Building2 } from "lucide-react";
import Link from "next/link";
import { InvoiceStatus } from "@prisma/client";

// Types
export type InvoiceWithRelations = {
    id: string;
    invoiceNumber: string;
    studentId: string;
    subtotal: number | any;
    status: InvoiceStatus;
    dueDate: Date;
    createdAt: Date;
    notes: string | null;
    student: {
        id: string;
        fullName: string;
        email: string | null;
        studentNumber: string | null;
    };
    items: {
        id: string;
        description: string;
        quantity: number | any;
        unitPrice: number | any;
        amount: number | any;
    }[];
};

interface InvoiceTableProps {
    invoices: InvoiceWithRelations[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<string>("ALL");

    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelations | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const handlePrint = () => {
        window.print();
    };

    const handleOpenPreview = (inv: InvoiceWithRelations) => {
        setSelectedInvoice(inv);
        setIsPreviewOpen(true);
    };

    // Filter Logic
    const filteredInvoices = invoices.filter((inv) => {
        const matchesSearch =
            inv.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "ALL" || inv.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const getStatusBadge = (status: InvoiceStatus) => {
        switch (status) {
            case "PAID":
                return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Lunas</span>;
            case "PARTIALLY_PAID":
                return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Dicicil</span>;
            case "ISSUED":
            case "DRAFT":
                return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu</span>;
            case "OVERDUE":
                return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-200 inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Jatuh Tempo</span>;
            case "CANCELLED":
                return <span className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-200 inline-flex items-center gap-1"><X className="w-3 h-3" /> Dibatalkan</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Invoice</h1>
                    <p className="text-sm text-slate-500">Kelola tagihan, pantau pembayaran, dan generate dokumen invoice resmi.</p>
                </div>
                <Link
                    href="/management/invoices/create"
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-950 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Buat Invoice Baru
                </Link>
            </div>

            {/* 2. Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold">Total Invoice Diterbitkan</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{invoices.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold">Total Piutang (Menunggu)</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">
                        {formatRupiah(invoices.filter((i) => i.status === "ISSUED" || i.status === "DRAFT").reduce((a, b) => a + Number(b.subtotal), 0))}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold">Total Jatuh Tempo (Overdue)</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">
                        {formatRupiah(invoices.filter((i) => i.status === "OVERDUE").reduce((a, b) => a + Number(b.subtotal), 0))}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold">Total Penerimaan (Paid)</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">
                        {formatRupiah(invoices.filter((i) => i.status === "PAID").reduce((a, b) => a + Number(b.subtotal), 0))}
                    </p>
                </div>
            </div>

            {/* 3. Table Header Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
                        {[
                            { value: "ALL", label: "Semua" },
                            { value: "ISSUED", label: "Menunggu" },
                            { value: "PARTIALLY_PAID", label: "Dicicil" },
                            { value: "PAID", label: "Lunas" },
                            { value: "OVERDUE", label: "Jatuh Tempo" }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === tab.value
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari No. Invoice / Nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>
                </div>

                {/* 4. Invoice Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                                <th className="py-3 px-4">No. Invoice</th>
                                <th className="py-3 px-4">Siswa / Klien</th>
                                <th className="py-3 px-4">Tanggal</th>
                                <th className="py-3 px-4">Tenggat Waktu</th>
                                <th className="py-3 px-4">Subtotal</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-blue-900">{inv.invoiceNumber}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-slate-900">{inv.student.fullName}</div>
                                            <div className="text-xs text-slate-400">{inv.student.email}</div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">{new Date(inv.createdAt).toLocaleDateString("id-ID")}</td>
                                        <td className="py-3 px-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString("id-ID")}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-900">{formatRupiah(Number(inv.subtotal))}</td>
                                        <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenPreview(inv)}
                                                    title="Lihat Detail & Preview"
                                                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenPreview(inv)}
                                                    title="Cetak PDF Resmi"
                                                    className="p-1.5 hover:bg-slate-100 rounded-md text-blue-900"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button title="Catat Pembayaran" className="p-1.5 hover:bg-slate-100 rounded-md text-emerald-600">
                                                    <CreditCard className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-slate-400">
                                        Tidak ada invoice yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. MODAL PREVIEW & CETAK INVOICE RESMI */}
            {isPreviewOpen && selectedInvoice && (
                <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">

                        {/* Header Modal Action */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-100 print:hidden">
                            <h3 className="font-bold text-slate-800 text-sm">Preview Dokumen Invoice Resmi</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold hover:bg-blue-950 transition-colors"
                                >
                                    <Printer className="w-4 h-4" /> Cetak / Download PDF
                                </button>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* AREA DOKUMEN CETAK INVOICE */}
                        <div className="p-8 overflow-y-auto print:p-0" id="printable-invoice">
                            <div className="flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-blue-900 tracking-wide">PT DUA PERMATA NUSANTARA</h1>
                                        <p className="text-xs text-slate-500">Gedung Permata Lt. 3, Jl. Sudirman No. 45, Jakarta Pusat</p>
                                        <p className="text-xs text-slate-500">Email: finance@duapermata.co.id | Telp: (021) 555-0199</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-wider">INVOICE</h2>
                                    <p className="text-xs font-mono text-blue-900 font-bold">{selectedInvoice.invoiceNumber}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-xs mb-6">
                                <div>
                                    <span className="text-slate-400 font-semibold uppercase block mb-1">Ditujukan Kepada:</span>
                                    <p className="font-bold text-slate-800 text-sm">{selectedInvoice.student.fullName}</p>
                                    <p className="text-slate-600">{selectedInvoice.student.email}</p>
                                    <p className="text-slate-600">ID Siswa: {selectedInvoice.student.studentNumber || "-"}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="flex justify-end gap-2">
                                        <span className="text-slate-500">Tanggal Terbit:</span>
                                        <span className="font-semibold text-slate-800">{new Date(selectedInvoice.createdAt).toLocaleDateString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <span className="text-slate-500">Jatuh Tempo:</span>
                                        <span className="font-semibold text-slate-800">{new Date(selectedInvoice.dueDate).toLocaleDateString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-end gap-2 items-center">
                                        <span className="text-slate-500">Status:</span>
                                        <span className="font-bold text-blue-900">{getStatusBadge(selectedInvoice.status)}</span>
                                    </div>
                                    {selectedInvoice.notes && (
                                         <div className="flex justify-end gap-2 mt-2">
                                            <span className="text-slate-500 whitespace-pre-wrap text-right">{selectedInvoice.notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse text-xs mb-6">
                                <thead>
                                    <tr className="bg-blue-900 text-white font-semibold">
                                        <th className="py-2 px-3 border border-blue-900">Deskripsi</th>
                                        <th className="py-2 px-3 border border-blue-900 text-center w-12">Qty</th>
                                        <th className="py-2 px-3 border border-blue-900 text-right w-28">Harga Satuan</th>
                                        <th className="py-2 px-3 border border-blue-900 text-right w-28">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.items.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-200">
                                            <td className="py-2 px-3 border-x border-slate-200">{item.description}</td>
                                            <td className="py-2 px-3 border-x border-slate-200 text-center">{Number(item.quantity)}</td>
                                            <td className="py-2 px-3 border-x border-slate-200 text-right">{formatRupiah(Number(item.unitPrice))}</td>
                                            <td className="py-2 px-3 border-x border-slate-200 text-right font-semibold">
                                                {formatRupiah(Number(item.amount))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="grid grid-cols-2 gap-6 text-xs pt-2 mb-8">
                                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                                    <p className="font-bold text-slate-800">Pembayaran Transfer Bank:</p>
                                    <p className="text-slate-600">Bank Mandiri: <span className="font-mono font-semibold">123-00-0987654-3</span></p>
                                    <p className="text-slate-600">A/N: PT Dua Permata Nusantara</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal:</span>
                                        <span>{formatRupiah(Number(selectedInvoice.subtotal))}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-300 pt-2">
                                        <span>Total Tagihan:</span>
                                        <span className="text-blue-900">{formatRupiah(Number(selectedInvoice.subtotal))}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-xs pt-6 border-t border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-700 mb-1">Syarat & Ketentuan:</p>
                                    <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                                        <li>Harap cantumkan Nomor Invoice pada berita transfer.</li>
                                        <li>Bukti pembayaran dikirimkan ke finance@duapermata.co.id</li>
                                    </ul>
                                </div>
                                <div className="text-center space-y-12">
                                    <p className="text-slate-600">Hormat Kami,</p>
                                    <div className="border-b border-slate-400 w-36 mx-auto"></div>
                                    <p className="font-bold text-slate-800">Finance Department</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
