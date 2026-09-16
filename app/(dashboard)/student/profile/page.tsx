"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
    User,
    GraduationCap,
    Globe,
    Award,
    Phone,
    Save,
    CheckCircle2,
    Lock,
} from "lucide-react";

type ProfileTab = "PERSONAL" | "ACADEMIC" | "TARGETS" | "EMERGENCY";

interface StudentProfileData {
    fullName: string;
    email: string;
    phone: string;
    passportNumber: string;
    passportExpiry: string;
    lastEducation: string;
    institutionName: string;
    gpa: string;
    englishTestType: "IELTS" | "TOEFL_IBT" | "PTE" | "NONE";
    englishScore: string;
    targetCountries: string[];
    targetMajor: string;
    targetDegree: string;
    parentName: string;
    parentPhone: string;
    parentRelation: string;
}

export default function ClientProfilePage() {
    const [activeTab, setActiveTab] = useState<ProfileTab>("PERSONAL");
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const [formData, setFormData] = useState<StudentProfileData>({
        fullName: "John Doe",
        email: "johndoe@example.com",
        phone: "+62 812 3456 7890",
        passportNumber: "C1234567",
        passportExpiry: "2029-12-31",
        lastEducation: "Bachelor's Degree (S1)",
        institutionName: "Universitas Indonesia",
        gpa: "3.75 / 4.00",
        englishTestType: "IELTS",
        englishScore: "7.5 (L:7.5, R:8.0, W:7.0, S:7.0)",
        targetCountries: ["Australia", "United Kingdom"],
        targetMajor: "Master of Data Science",
        targetDegree: "Master's Degree (S2)",
        parentName: "Robert Doe",
        parentPhone: "+62 811 9876 5432",
        parentRelation: "Ayah Kandung",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Student */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0">
                        JD
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{formData.fullName}</h1>
                        <p className="text-xs text-slate-500">
                            ID Siswa: <span className="font-semibold text-slate-700">STD-2026-089</span> • {formData.email}
                        </p>
                    </div>
                </div>

                {isSaved && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Perubahan Tersimpan!</span>
                    </div>
                )}
            </div>

            {/* Segmented Control / Tab Navigasi Profil */}
            <div className="flex items-center gap-2">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("PERSONAL")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "PERSONAL"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Data Pribadi & Paspor
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("ACADEMIC")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "ACADEMIC"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Akademik & Bahasa
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("TARGETS")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "TARGETS"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Target Studi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("EMERGENCY")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "EMERGENCY"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Kontak Darurat
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                {/* TAB 1: DATA PRIBADI */}
                {activeTab === "PERSONAL" && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-slate-700" /> Informasi Pribadi & Paspor
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap (Sesuai Paspor)</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nomor Paspor</label>
                                <input
                                    type="text"
                                    name="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Masa Berlaku Paspor</label>
                                <input
                                    type="date"
                                    name="passportExpiry"
                                    value={formData.passportExpiry}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: AKADEMIK */}
                {activeTab === "ACADEMIC" && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-slate-700" /> Kualifikasi Akademik & Kemampuan Bahasa
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                                <input
                                    type="text"
                                    name="lastEducation"
                                    value={formData.lastEducation}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah / Universitas</label>
                                <input
                                    type="text"
                                    name="institutionName"
                                    value={formData.institutionName}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">IPK / Nilai Rata-rata</label>
                                <input
                                    type="text"
                                    name="gpa"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Tes Bahasa Inggris</label>
                                <select
                                    name="englishTestType"
                                    value={formData.englishTestType}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                >
                                    <option value="IELTS">IELTS</option>
                                    <option value="TOEFL_IBT">TOEFL iBT</option>
                                    <option value="PTE">PTE Academic</option>
                                    <option value="NONE">Belum Ada</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block font-semibold text-slate-700 mb-1">Skor Rincian Tes Bahasa</label>
                                <input
                                    type="text"
                                    name="englishScore"
                                    value={formData.englishScore}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: TARGET STUDI */}
                {activeTab === "TARGETS" && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-slate-700" /> Rencana & Target Studi Luar Negeri
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Jenjang Target</label>
                                <input
                                    type="text"
                                    name="targetDegree"
                                    value={formData.targetDegree}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Jurusan / Program Studi Target</label>
                                <input
                                    type="text"
                                    name="targetMajor"
                                    value={formData.targetMajor}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: KONTAK DARURAT */}
                {activeTab === "EMERGENCY" && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-slate-700" /> Kontak Orang Tua / Wali
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Hubungan</label>
                                <input
                                    type="text"
                                    name="parentRelation"
                                    value={formData.parentRelation}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Orang Tua / Wali</label>
                                <input
                                    type="text"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button Footer */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                    </button>
                </div>
            </form>
        </div>
    );
}