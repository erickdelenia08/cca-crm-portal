"use client";

import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Save,
    Shield,
    GraduationCap,
    Briefcase,
    Globe,
    Award,
    BookOpen,
    CheckCircle2,
} from "lucide-react";

type UserRole = "consultant" | "student" | "admin";

export default function UniversalProfilePage() {
    // Mock Active Role (Bisa diganti: 'consultant' | 'student' | 'admin')
    const [role, setRole] = useState<UserRole>("consultant");

    // Tab State Pengaturan Profil
    const [activeTab, setActiveTab] = useState<"general" | "security" | "role_specific">("general");

    // Form State Umum (Semua Role)
    const [fullName, setFullName] = useState("Budi Santoso");
    const [email, setEmail] = useState("budi.santoso@email.com");
    const [phone, setPhone] = useState("+62 812-3456-7890");
    const [bio, setBio] = useState("Passionate educator & tech enthusiast.");

    // Form State Keamanan
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Form State Spesifik Konsultan
    const [title, setTitle] = useState("Senior Education Consultant");
    const [expertise, setExpertise] = useState("Computer Science, STEM, Essay Review");
    const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/budisantoso");

    // Form State Spesifik Siswa
    const [targetDegree, setTargetDegree] = useState("S2 / Master");
    const [targetMajor, setTargetMajor] = useState("Computer Science & AI");
    const [originSchool, setOriginSchool] = useState("Institut Teknologi Bandung");

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Perubahan profil berhasil disimpan!");
    };

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            {/* Header & Avatar Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border-2 border-blue-200">
                            {fullName.charAt(0)}
                        </div>
                        <button
                            title="Ubah Foto Profil"
                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
                            {/* Badge Role Dynamic */}
                            <span className="capitalize text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                Role: {role}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">{email}</p>
                    </div>
                </div>

                {/* Demo Switcher Role (Hanya untuk preview Dev UI) */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start md:self-auto text-xs font-semibold">
                    <span className="text-[10px] text-slate-400 px-2 uppercase">Switch Preview:</span>
                    {(["consultant", "student", "admin"] as UserRole[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-2.5 py-1 rounded-md capitalize transition-all ${role === r ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 space-x-6">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`pb-3 text-xs font-bold transition-all ${activeTab === "general"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Informasi Umum
                </button>

                <button
                    onClick={() => setActiveTab("role_specific")}
                    className={`pb-3 text-xs font-bold transition-all ${activeTab === "role_specific"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    {role === "consultant" && "Profil Profesional Konsultan"}
                    {role === "student" && "Target Akademik Siswa"}
                    {role === "admin" && "Wewenang System Admin"}
                </button>

                <button
                    onClick={() => setActiveTab("security")}
                    className={`pb-3 text-xs font-bold transition-all ${activeTab === "security"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Keamanan & Akun
                </button>
            </div>

            {/* TAB 1: INFORMASI UMUM (Semua Role) */}
            {activeTab === "general" && (
                <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">
                        Data Diri Utama
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bio Singkat</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-300 rounded-lg p-3 bg-white focus:outline-hidden focus:border-blue-500 resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                        >
                            <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                        </button>
                    </div>
                </form>
            )}

            {/* TAB 2: ROLE SPECIFIC CONTENT */}
            {activeTab === "role_specific" && (
                <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    {/* A. Role Konsultan */}
                    {role === "consultant" && (
                        <>
                            <h2 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-blue-600" /> Kredensial & Kepakaran Konsultan
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar / Headline Spesialisasi</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Profil LinkedIn</label>
                                    <input
                                        type="url"
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Bidang Keahlian (Pisahkan koma)</label>
                                <input
                                    type="text"
                                    value={expertise}
                                    onChange={(e) => setExpertise(e.target.value)}
                                    className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* B. Role Siswa */}
                    {role === "student" && (
                        <>
                            <h2 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-blue-600" /> Target Studi & Pendidikan Lanjutan
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Asal Sekolah / Universitas</label>
                                    <input
                                        type="text"
                                        value={originSchool}
                                        onChange={(e) => setOriginSchool(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Jenjang Pendidikan</label>
                                    <select
                                        value={targetDegree}
                                        onChange={(e) => setTargetDegree(e.target.value)}
                                        className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                    >
                                        <option value="S1 / Bachelor">S1 / Bachelor Degree</option>
                                        <option value="S2 / Master">S2 / Master Degree</option>
                                        <option value="S3 / Doctoral">S3 / Doctoral Degree</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Jurusan / Minat Studi</label>
                                <input
                                    type="text"
                                    value={targetMajor}
                                    onChange={(e) => setTargetMajor(e.target.value)}
                                    className="w-full text-xs font-medium border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* C. Role Admin */}
                    {role === "admin" && (
                        <>
                            <h2 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-600" /> Hak Akses Administrator
                            </h2>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                                <p className="flex items-center gap-2 font-bold text-slate-800">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Akses Penuh Sistem (Super Admin)
                                </p>
                                <p>• Mengelola manajemen pengguna, konsultan, dan akun siswa.</p>
                                <p>• Mengatur persetujuan payroll dan konfigurasi aplikasi.</p>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                        >
                            <Save className="w-3.5 h-3.5" /> Simpan Pengaturan Role
                        </button>
                    </div>
                </form>
            )}

            {/* TAB 3: KEAMANAN (Semua Role) */}
            {activeTab === "security" && (
                <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">
                        Ubah Password
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Password Saat Ini</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}