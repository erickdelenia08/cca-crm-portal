'use client'
// import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileCheck, ExternalLink, Upload, AlertCircle } from 'lucide-react';

interface InvoiceDocumentCardProps {
    enrollmentId: string;
    paymentReceiptUrl?: string; // Bukti bayar dari client
    isDocVerifiedByDept: boolean; // Flag status kelengkapan dari Dept. Dokumen
}

export default function InvoiceDocumentCard({
    enrollmentId,
    paymentReceiptUrl,
    isDocVerifiedByDept
}: InvoiceDocumentCardProps) {
    const router = useRouter();

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileCheck className="w-5 h-5 text-blue-600" /> Dokumen Transaksi & Syarat
            </h2>

            {/* 1. Dokumen Keuangan Spesifik (Bukti Transfer) */}
            <div className="space-y-2 text-sm">
                <span className="text-xs text-gray-500 font-medium">Bukti Pembayaran Client:</span>
                {paymentReceiptUrl ? (
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-xs font-mono text-gray-700 truncate max-w-[150px]">
                            receipt_inv-889.pdf
                        </span>
                        <a
                            href={paymentReceiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                        >
                            Lihat File <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                ) : (
                    <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center space-y-1">
                        <p className="text-xs text-gray-500">Belum ada bukti transfer</p>
                        <button className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
                            <Upload className="w-3 h-3" /> Unggah Bukti Bayar
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Status Cross-Module dari Dept. Dokumen */}
            <div className="pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2 text-xs">
                    {isDocVerifiedByDept ? (
                        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                        <p className="font-medium text-gray-900">Status Dokumen Syarat Visa</p>
                        <p className="text-gray-500">
                            {isDocVerifiedByDept
                                ? 'Seluruh dokumen persyaratan program telah disetujui Dept. Dokumen.'
                                : 'Masih ada dokumen persyaratan program yang butuh revisi/verifikasi.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Link ke Dept Dokumen */}
            <button
                onClick={() => router.push(`/management/documents?enrollmentId=${enrollmentId}`)}
                className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
                Cek Berkas di Dept. Dokumen <ExternalLink className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}