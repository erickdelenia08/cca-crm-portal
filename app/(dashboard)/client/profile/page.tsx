"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
    User,
    GraduationCap,
    Globe,
    Phone,
    Save,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Camera,
    KeyRound,
    Smartphone,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
    Copy,
    QrCode,
} from "lucide-react";

type ProfileTab = "PERSONAL" | "SECURITY" | "ACADEMIC" | "TARGETS" | "EMERGENCY";

interface StudentProfileData {
    // Account Level
    avatarUrl: string;
    studentNumber: string;
    fullName: string;
    email: string;
    enrolledType: "PROGRAM" | "COURSE"; // Penentu fitur dinamis

    // Personal & Contact
    phone: string;

    // Passport & Academic
    passportNumber: string;
    passportExpiry: string;
    lastEducation: string;
    institutionName: string;
    gpa: string;
    englishTestType: "IELTS" | "TOEFL_IBT" | "PTE" | "NONE";
    englishScore: string;

    // Targets (Khusus Program)
    targetCountries: string;
    targetMajor: string;
    targetDegree: string;

    // Emergency (Khusus Program)
    parentName: string;
    parentPhone: string;
    parentRelation: string;
}

export default function ClientProfilePage() {
    const [activeTab, setActiveTab] = useState<ProfileTab>("PERSONAL");
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // State Keamanan & Password
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State 2FA
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [copiedKey, setCopiedKey] = useState(false);

    // State Profil Siswa
    const [formData, setFormData] = useState<StudentProfileData>({
        avatarUrl: "",
        studentNumber: "STD-2026-089",
        fullName: "John Doe",
        email: "johndoe@example.com",
        enrolledType: "PROGRAM", // Ubah ke "COURSE" untuk uji coba tampilan Short Course
        phone: "+62 812 3456 7890",
        passportNumber: "C1234567",
        passportExpiry: "2029-12-31",
        lastEducation: "Bachelor's Degree (S1)",
        institutionName: "Universitas Indonesia",
        gpa: "3.75 / 4.00",
        englishTestType: "IELTS",
        englishScore: "7.5 (L:7.5, R:8.0, W:7.0, S:7.0)",
        targetCountries: "Australia, United Kingdom",
        targetMajor: "Master of Data Science",
        targetDegree: "Master's Degree (S2)",
        parentName: "Robert Doe",
        parentPhone: "+62 811 9876 5432",
        parentRelation: "Ayah Kandung",
    });

    const isProgramStudent = formData.enrolledType === "PROGRAM";

    // Validasi Password Real-time
    const passwordValidations = {
        minLength: newPassword.length >= 8,
        hasUpper: /[A-Z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSymbol: /[^A-Za-z0-9]/.test(newPassword),
        isMatch: newPassword !== "" && newPassword === confirmPassword,
    };

    const strengthScore = [
        passwordValidations.minLength,
        passwordValidations.hasUpper,
        passwordValidations.hasNumber,
        passwordValidations.hasSymbol,
    ].filter(Boolean).length;

    const getStrengthLabel = () => {
        if (newPassword.length === 0) return { label: "", color: "bg-slate-200" };
        if (strengthScore <= 1) return { label: "Sangat Lemah", color: "bg-red-500" };
        if (strengthScore === 2) return { label: "Sedang", color: "bg-amber-500" };
        if (strengthScore === 3) return { label: "Bagus", color: "bg-blue-500" };
        return { label: "Sangat Kuat", color: "bg-emerald-500" };
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // API integration point
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopySecretKey = () => {
        navigator.clipboard.writeText("K7XW-9J2L-M4PQ-8R1S");
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const handleVerify2FA = () => {
        if (otpCode.length === 6) {
            setIs2FAEnabled(true);
            setShow2FAModal(false);
            setOtpCode("");
            alert("Autentikasi Dua Faktor (2FA) berhasil diaktifkan!");
        } else {
            alert("Masukkan 6 digit kode OTP yang valid!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* HEADER: Foto Profil & Informasi Ringkas */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative group shrink-0">
                        <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-xs">
                            {formData.avatarUrl ? (
                                <img
                                    src={formData.avatarUrl}
                                    alt={formData.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                formData.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                            title="Ubah Foto Profil"
                        >
                            <Camera className="w-3.5 h-3.5" />
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            avatarUrl: URL.createObjectURL(file),
                                        }));
                                    }
                                }}
                            />
                        </label>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">
                                {formData.fullName}
                            </h1>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isProgramStudent
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                    }`}
                            >
                                {isProgramStudent ? "Intensive Program" : "Short Course"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            ID Siswa:{" "}
                            <span className="font-semibold text-slate-700">
                                {formData.studentNumber}
                            </span>{" "}
                            • {formData.email}
                        </p>
                    </div>
                </div>

                {isSaved && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Perubahan Tersimpan!</span>
                    </div>
                )}
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveTab("PERSONAL")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "PERSONAL"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Data Pribadi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("SECURITY")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "SECURITY"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Keamanan & Password
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

                    {/* Tab Khusus Siswa Program/Bootcamp */}
                    {isProgramStudent && (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {/* FORM CONTENT */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl border border-slate-200 space-y-6"
            >
                {/* TAB 1: DATA PRIBADI */}
                {activeTab === "PERSONAL" && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-slate-700" /> Informasi Diri
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                                    <span>Nama Lengkap</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Lock Admin
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    disabled
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                                    <span>Email</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Lock Admin
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Nomor WhatsApp / HP
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            {isProgramStudent && (
                                <>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">
                                            Nomor Paspor (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={handleChange}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">
                                            Masa Berlaku Paspor
                                        </label>
                                        <input
                                            type="date"
                                            name="passportExpiry"
                                            value={formData.passportExpiry}
                                            onChange={handleChange}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: KEAMANAN & PASSWORD */}
                {activeTab === "SECURITY" && (
                    <div className="space-y-8 text-xs">
                        {/* UBASH PASSWORD */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <KeyRound className="w-4 h-4 text-slate-700" /> Pengaturan Kata Sandi
                                </h2>
                                <button
                                    type="button"
                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={() => alert("Link reset password telah dikirim ke email kamu.")}
                                >
                                    Lupa kata sandi saat ini?
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">
                                            Kata Sandi Saat Ini
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Masukkan kata sandi lama"
                                                className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">
                                            Kata Sandi Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Masukkan kata sandi baru"
                                                className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {newPassword && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-500">Kekuatan Password:</span>
                                                    <span className="font-bold text-slate-700">{getStrengthLabel().label}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                                                    <div className={`h-full flex-1 transition-all ${strengthScore >= 1 ? getStrengthLabel().color : "bg-slate-200"}`} />
                                                    <div className={`h-full flex-1 transition-all ${strengthScore >= 2 ? getStrengthLabel().color : "bg-slate-200"}`} />
                                                    <div className={`h-full flex-1 transition-all ${strengthScore >= 3 ? getStrengthLabel().color : "bg-slate-200"}`} />
                                                    <div className={`h-full flex-1 transition-all ${strengthScore === 4 ? getStrengthLabel().color : "bg-slate-200"}`} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">
                                            Konfirmasi Kata Sandi Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Ulangi kata sandi baru"
                                                className={`w-full p-2.5 pr-10 bg-white border rounded-lg text-slate-800 focus:outline-none ${confirmPassword && !passwordValidations.isMatch
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-slate-200 focus:border-blue-600"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {confirmPassword && !passwordValidations.isMatch && (
                                            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Kata sandi tidak cocok
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                                    <div>
                                        <p className="font-bold text-slate-800 mb-3">Syarat Kata Sandi:</p>
                                        <ul className="space-y-2 text-[11px]">
                                            <li className={`flex items-center gap-2 ${passwordValidations.minLength ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                {passwordValidations.minLength ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                                <span>Minimal 8 karakter</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordValidations.hasUpper ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                {passwordValidations.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                                <span>Mengandung huruf besar (A-Z)</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordValidations.hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                {passwordValidations.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                                <span>Mengandung angka (0-9)</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordValidations.hasSymbol ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                {passwordValidations.hasSymbol ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                                <span>Mengandung karakter khusus (!@#$%^&*)</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500">
                                        💡 Kata sandi yang kuat membantu melindungi data pribadi dan dokumen penting kamu.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* AUTENTIKASI 2FA */}
                        <div className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-slate-700" /> Lapisan Keamanan Tambahan
                            </h2>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-xs">
                                        <Smartphone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900">Autentikasi Dua Faktor (2FA)</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${is2FAEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                                                {is2FAEnabled ? "Aktif" : "Non-aktif"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Amankan akun menggunakan kode OTP dari Google Authenticator atau Authy.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (is2FAEnabled) {
                                            if (confirm("Apakah kamu yakin ingin menonaktifkan 2FA?")) {
                                                setIs2FAEnabled(false);
                                            }
                                        } else {
                                            setShow2FAModal(true);
                                        }
                                    }}
                                    className={`px-3.5 py-1.5 font-semibold rounded-lg text-xs transition-colors ${is2FAEnabled
                                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                        : "bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
                                        }`}
                                >
                                    {is2FAEnabled ? "Matikan 2FA" : "Atur 2FA"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: AKADEMIK & BAHASA */}
                {activeTab === "ACADEMIC" && (
                    <div className="space-y-4 text-xs">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-slate-700" /> Latar Belakang Pendidikan
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Pendidikan Terakhir
                                </label>
                                <input
                                    type="text"
                                    name="lastEducation"
                                    value={formData.lastEducation}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Nama Institusi / Sekolah
                                </label>
                                <input
                                    type="text"
                                    name="institutionName"
                                    value={formData.institutionName}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Tes Bahasa Inggris
                                </label>
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
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Skor Bahasa (Contoh: Overall / Band)
                                </label>
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

                {/* TAB 4: TARGET STUDI (Hanya Siswa Program) */}
                {activeTab === "TARGETS" && isProgramStudent && (
                    <div className="space-y-4 text-xs">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-slate-700" /> Target Studi Luar Negeri
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Jenjang Target
                                </label>
                                <input
                                    type="text"
                                    name="targetDegree"
                                    value={formData.targetDegree}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Jurusan Target
                                </label>
                                <input
                                    type="text"
                                    name="targetMajor"
                                    value={formData.targetMajor}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Negara Tujuan (Pisahkan Koma)
                                </label>
                                <input
                                    type="text"
                                    name="targetCountries"
                                    value={formData.targetCountries}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: KONTAK DARURAT (Hanya Siswa Program) */}
                {activeTab === "EMERGENCY" && isProgramStudent && (
                    <div className="space-y-4 text-xs">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-slate-700" /> Kontak Orang Tua / Wali
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Nama Orang Tua / Wali
                                </label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Hubungan
                                </label>
                                <input
                                    type="text"
                                    name="parentRelation"
                                    value={formData.parentRelation}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Nomor Telepon Orang Tua
                                </label>
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

                {/* SUBMIT BUTTON */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                    </button>
                </div>
            </form>

            {/* MODAL SETUP 2FA */}
            {show2FAModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-blue-600" /> Setup Autentikasi 2 Faktor
                            </h3>
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs text-slate-600">
                            <p>1. Scan QR code ini dengan aplikasi **Google Authenticator** atau **Authy**.</p>

                            <div className="flex justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                {/* SVG Mockup QR Code */}
                                <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center">
                                    <div className="w-full h-full bg-slate-900 grid grid-cols-4 gap-1 p-2">
                                        <div className="bg-white col-span-2 row-span-2"></div>
                                        <div className="bg-white"></div>
                                        <div className="bg-white"></div>
                                        <div className="bg-white"></div>
                                        <div className="bg-white col-span-2 row-span-2"></div>
                                    </div>
                                </div>
                            </div>

                            <p>2. Atau masukkan Kunci Rahasia ini secara manual:</p>
                            <div className="flex items-center justify-between p-2.5 bg-slate-100 border border-slate-200 rounded-lg">
                                <span className="font-mono font-bold text-slate-800">K7XW-9J2L-M4PQ-8R1S</span>
                                <button
                                    type="button"
                                    onClick={handleCopySecretKey}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{copiedKey ? "Tersalin!" : "Salin"}</span>
                                </button>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    3. Masukkan 6 Digit Kode dari Aplikasi
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="000000"
                                    className="w-full p-2.5 text-center font-mono tracking-widest text-lg font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShow2FAModal(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleVerify2FA}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                            >
                                Verifikasi & Aktifkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}