"use client";

import { useState } from "react";
import {
    User,
    GraduationCap,
    Plane,
    Languages,
    BookOpen,
    CheckCircle2,
    // Passport,
    // ArrowRight
} from "lucide-react";

export type ProgramType = "STUDY_ABROAD" | "WHV" | "ENGLISH_COURSE" | "MANDARIN_COURSE";

export default function StudentOnboardingModal({
    isOpen,
    initialProgram = "STUDY_ABROAD",
    onComplete,
}: {
    isOpen: boolean;
    initialProgram?: ProgramType;
    onComplete: () => void;
}) {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType>(initialProgram);

    // State Form Lengkap
    const [formData, setFormData] = useState({
        // General
        phone: "",
        passportNumber: "",
        // Study Abroad
        lastEducation: "",
        targetCountry: "Australia",
        targetUniversity: "",
        // WHV
        ieltsScore: "",
        bankProofReady: false,
        // English / Mandarin Course
        currentLevel: "Beginner",
        courseGoal: "IELTS Preparation",
        hskTarget: "HSK 3",
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

                {/* Header Onboarding */}
                <div className="bg-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/50 px-2.5 py-1 rounded-md">
                            Lengkapi Profil Siswa / Klien
                        </span>
                        <span className="text-xs font-mono font-medium opacity-80">CCA-2026-STD</span>
                    </div>
                    <h2 className="text-xl font-bold mt-2">Pendaftaran Program Utama</h2>
                    <p className="text-xs text-blue-100 mt-1">
                        Pilih program yang diambil dan isi data spesifik untuk memulai bimbingan/kelas.
                    </p>
                </div>

                <div className="p-6 space-y-5 text-xs">

                    {/* Pilihan 4 Program Utama */}
                    <div>
                        <label className="block font-bold text-slate-800 mb-2">Program Utama yang Diikuti *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "STUDY_ABROAD", label: "Study Abroad", icon: GraduationCap },
                                { id: "WHV", label: "Visa Holiday (WHV)", icon: Plane },
                                { id: "ENGLISH_COURSE", label: "English Course", icon: Languages },
                                { id: "MANDARIN_COURSE", label: "Mandarin Course", icon: BookOpen },
                            ].map((item) => {
                                const Icon = item.icon;
                                const isSelected = selectedProgram === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedProgram(item.id as ProgramType)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border text-left font-bold transition-all ${isSelected
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
                                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                                        <span className="text-xs">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Umum (Kontak) */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-600" /> Kontak WhatsApp & Paspor
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp *</label>
                                <input
                                    type="text"
                                    placeholder="+62 812-xxxx-xxxx"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 font-semibold mb-1">No. Paspor (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="A12345678"
                                    value={formData.passportNumber}
                                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC FIELD PER PROGRAM */}

                    {/* 1. Form Khusus Study Abroad */}
                    {selectedProgram === "STUDY_ABROAD" && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Detail Study Abroad
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Pendidikan Terakhir *</label>
                                    <input
                                        type="text"
                                        placeholder="misal: S1 Teknik UI / SMA 1"
                                        value={formData.lastEducation}
                                        onChange={(e) => setFormData({ ...formData, lastEducation: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Negara Tujuan</label>
                                    <select
                                        value={formData.targetCountry}
                                        onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                                    >
                                        <option value="Australia">Australia</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Germany">Germany</option>
                                        <option value="China">China</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Form Khusus Working Holiday Visa (WHV) */}
                    {selectedProgram === "WHV" && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <Plane className="w-3.5 h-3.5 text-blue-600" /> Persyaratan WHV
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Skor IELTS / PTE (Jika ada)</label>
                                    <input
                                        type="text"
                                        placeholder="misal: IELTS 4.5+ / PTE 30+"
                                        value={formData.ieltsScore}
                                        onChange={(e) => setFormData({ ...formData, ieltsScore: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Bukti Rekening ($5,000 AUD)</label>
                                    <select
                                        value={formData.bankProofReady ? "READY" : "NOT_READY"}
                                        onChange={(e) => setFormData({ ...formData, bankProofReady: e.target.value === "READY" })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                                    >
                                        <option value="NOT_READY">Belum Siap / Butuh Konsultasi</option>
                                        <option value="READY">Sudah Siap</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Form Khusus English Course */}
                    {selectedProgram === "ENGLISH_COURSE" && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <Languages className="w-3.5 h-3.5 text-blue-600" /> Detail Kelas Bahasa Inggris
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Level Saat Ini</label>
                                    <select
                                        value={formData.currentLevel}
                                        onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                                    >
                                        <option value="Beginner">Beginner (Pemula)</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Tujuan Belajar</label>
                                    <select
                                        value={formData.courseGoal}
                                        onChange={(e) => setFormData({ ...formData, courseGoal: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                                    >
                                        <option value="IELTS Preparation">IELTS Preparation</option>
                                        <option value="TOEFL Preparation">TOEFL Preparation</option>
                                        <option value="General Conversation">General Conversation</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Form Khusus Mandarin Course */}
                    {selectedProgram === "MANDARIN_COURSE" && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Detail Kelas Mandarin
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Target HSK</label>
                                    <select
                                        value={formData.hskTarget}
                                        onChange={(e) => setFormData({ ...formData, hskTarget: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold"
                                    >
                                        <option value="HSK 1-2">HSK 1 - 2 (Basic)</option>
                                        <option value="HSK 3-4">HSK 3 - 4 (Intermediate)</option>
                                        <option value="HSK 5-6">HSK 5 - 6 (Advanced Study in China)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-600 font-semibold mb-1">Kemampuan Hanzi (Karakter)</label>
                                    <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold">
                                        <option value="NONE">Belum Bisa Sama Sekali</option>
                                        <option value="PINYIN">Bisa Pinyin Saja</option>
                                        <option value="BASIC_HANZI">Bisa Hanzi Dasar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Navigation */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">* Wajib diisi</span>
                    <button
                        onClick={onComplete}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-2xs"
                    >
                        <span>Simpan & Masuk Portal</span>
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}