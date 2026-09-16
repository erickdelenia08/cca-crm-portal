"use client";

import { useState } from "react";
import { HardDrive, CloudUpload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function AdminBackupPage() {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [lastBackup, setLastBackup] = useState<string | null>("05 Sep 2026, 14:30 WIB");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleManualBackup = async () => {
        setIsBackingUp(true);
        setStatusMessage(null);

        try {
            // Panggil API Route Next.js untuk proses sync MinIO -> GDrive
            const res = await fetch("/api/admin/backup", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                setLastBackup(new Date().toLocaleString("id-ID"));
                setStatusMessage("Backup data dari MinIO ke Google Drive berhasil!");
            } else {
                setStatusMessage(`Gagal: ${data.message || "Terjadi kesalahan sistem."}`);
            }
        } catch (error) {
            setStatusMessage("Gagal terhubung ke server.");
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Backup Data & Penyimpanan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pencadangan manual seluruh dokumen dari MinIO Storage ke Google Drive Arsip.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Status Pencadangan</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Terakhir di-backup: <span className="font-semibold text-slate-700">{lastBackup || "Belum pernah"}</span>
                        </p>
                    </div>
                </div>

                {statusMessage && (
                    <div className={`p-4 rounded-lg text-xs font-medium flex items-center gap-2 ${statusMessage.startsWith("Gagal")
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                        {statusMessage.startsWith("Gagal") ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        <span>{statusMessage}</span>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        onClick={handleManualBackup}
                        disabled={isBackingUp}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-2xs w-full sm:w-auto cursor-pointer"
                    >
                        {isBackingUp ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Memproses Sync ke Google Drive...</span>
                            </>
                        ) : (
                            <>
                                <CloudUpload className="w-4 h-4" />
                                <span>Jalankan Backup Sekarang</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}