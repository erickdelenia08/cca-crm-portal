"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Building,
    HardDrive,
    ShieldCheck,
    Bell,
    Mail,
    Save,
    CheckCircle2,
    CloudUpload
} from "lucide-react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pengaturan Sistem
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Kelola profil lembaga, integrasi penyimpanan, pemberitahuan, dan preferensi sistem.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${activeTab === "general"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <Building className="w-4 h-4" />
                        Profil Lembaga
                    </button>

                    <button
                        onClick={() => setActiveTab("storage")}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${activeTab === "storage"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <HardDrive className="w-4 h-4" />
                        Penyimpanan & Backup
                    </button>

                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${activeTab === "notifications"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <Bell className="w-4 h-4" />
                        Notifikasi & Email
                    </button>
                </nav>
            </div>

            {/* Notification Success Toast */}
            {isSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Pengaturan berhasil disimpan.
                </div>
            )}

            {/* TAB 1: GENERAL SETTINGS */}
            {activeTab === "general" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                    <h2 className="text-base font-bold text-slate-900">Informasi Lembaga / Agensi</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nama Agensi / Lembaga
                            </label>
                            <input
                                type="text"
                                defaultValue="Global Education & Advisory"
                                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Kontak Utama
                            </label>
                            <input
                                type="email"
                                defaultValue="info@globaledu.com"
                                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Alamat Kantor Pusat
                            </label>
                            <textarea
                                rows={3}
                                defaultValue="Jl. H.R. Rasuna Said No. 12, Jakarta Selatan, Indonesia"
                                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: STORAGE & BACKUP SETTINGS */}
            {activeTab === "storage" && (
                <div className="space-y-6">
                    {/* Card Status Storage */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <h2 className="text-base font-bold text-slate-900">Konfigurasi Storage Aplikasi</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Primary Storage</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">MinIO Object Storage</h3>
                                <p className="text-xs text-slate-500 mt-1">Status: <span className="text-emerald-600 font-semibold">Terhubung</span></p>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Backup Target</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">Google Drive Archive</h3>
                                <p className="text-xs text-slate-500 mt-1">Status: <span className="text-emerald-600 font-semibold">Terhubung</span></p>
                            </div>
                        </div>

                        {/* Shortcut ke Halaman Manual Backup */}
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">Pencadangan Data Manual</h4>
                                <p className="text-xs text-blue-700 mt-0.5">
                                    Lakukan sync seluruh berkas siswa dan arsip dari MinIO ke Google Drive secara langsung.
                                </p>
                            </div>
                            <Link
                                href="/management/settings/backup"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
                            >
                                <CloudUpload className="w-3.5 h-3.5" />
                                Buka Halaman Backup
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {activeTab === "notifications" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Notifikasi & Email Otomatis</h2>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                            <div>
                                <p className="text-xs font-bold text-slate-800">Kirim Email Kredensial Siswa Baru</p>
                                <p className="text-[11px] text-slate-500">Otomatis kirim password sementara saat siswa terdaftar.</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                            <div>
                                <p className="text-xs font-bold text-slate-800">Notifikasi Tugas & Jadwal Pengajar</p>
                                <p className="text-[11px] text-slate-500">Kirim pengingat email ke Teacher setiap pagi.</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}