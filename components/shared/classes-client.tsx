"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    CheckCircle2,
    XCircle,
    X,
} from "lucide-react";
import { submitAbsenceRequest } from "@/actions/student-class.action";

type AttendanceStatus = "ON_TIME" | "LATE" | "ABSENT" | "EXCUSED";
type ClassMode = "ONLINE" | "OFFLINE" | "HYBRID";

interface AttendanceData {
    status: AttendanceStatus;
    note: string | null;
    attachmentUrl: string | null;
}

interface SessionData {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    mode: ClassMode;
    meetingUrl: string | null;
    location: string | null;
    attendances: AttendanceData[]; // Usually just 1 for this student
}

interface ClassData {
    id: string;
    code: string;
    name: string | null;
    startDate: Date;
    endDate: Date;
    course: { name: string; category: string | null };
    teacher: { fullName: string };
    sessions: SessionData[];
}

interface EnrollmentData {
    id: string;
    status: string;
    courseClass: ClassData;
}

interface ClassesClientProps {
    enrollments: EnrollmentData[];
}

export function ClassesClient({ enrollments }: ClassesClientProps) {
    const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");
    const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
    const [absenceReason, setAbsenceReason] = useState<string>("");
    const [absenceProof, setAbsenceProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Untuk MVP, kita ambil enrollment pertama (atau bisa dilooping jika ada banyak)
    const activeEnrollment = enrollments[0];
    
    if (!activeEnrollment) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
                <div className="bg-white p-5 rounded-xl border border-slate-200 text-center text-slate-500">
                    Anda belum terdaftar dalam kelas apapun.
                </div>
            </div>
        );
    }

    const classData = activeEnrollment.courseClass;
    const now = new Date();

    const upcomingSchedules = classData.sessions.filter(s => new Date(s.startTime) > now);
    const historySchedules = classData.sessions.filter(s => new Date(s.startTime) <= now);

    const completedSessionsCount = historySchedules.length;
    const totalSessions = classData.sessions.length;

    const progressPercentage = totalSessions > 0
        ? (completedSessionsCount / totalSessions) * 100
        : 0;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAbsenceProof(e.target.files[0]);
        }
    };

    const closeModal = () => {
        setSelectedSession(null);
        setAbsenceReason("");
        setAbsenceProof(null);
    };

    const handleAbsenceSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!absenceReason || !selectedSession) return;

        setIsSubmitting(true);
        // TODO: For a complete MVP, file upload to S3/MinIO should be done here to get a URL.
        // For now, we simulate success without the file URL.
        const fileUrl = absenceProof ? URL.createObjectURL(absenceProof) : null; 

        const res = await submitAbsenceRequest(selectedSession.id, absenceReason, fileUrl);
        setIsSubmitting(false);

        if (res.success) {
            alert("Pengajuan izin/sakit berhasil dikirim.");
            closeModal();
        } else {
            alert(res.error || "Gagal mengirim pengajuan.");
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            weekday: 'long',
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(date));
    };

    const formatTime = (start: Date, end: Date) => {
        const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
        return `${new Date(start).toLocaleTimeString("id-ID", timeOpts)} - ${new Date(end).toLocaleTimeString("id-ID", timeOpts)} WIB`;
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Kelas */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {classData.course.category?.replace("_", " ") || "KURSUS"}
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                            {classData.name || classData.course.name} ({classData.code})
                        </h1>
                    </div>
                    <div className="text-left sm:text-right">
                        <span className="text-xs font-semibold text-slate-500">
                            Progres Kehadiran
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                            {completedSessionsCount} / {totalSessions} Sesi Selesai
                        </p>
                    </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Switcher Tab */}
            <div className="flex items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("UPCOMING")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "UPCOMING"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Jadwal Mendatang
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "HISTORY"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Riwayat Kehadiran
                    </button>
                </div>

                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                    {activeTab === "UPCOMING"
                        ? `${upcomingSchedules.length} sesi mendatang`
                        : `${historySchedules.length} sesi tersimpan`}
                </span>
            </div>

            {/* TAB 1: JADWAL MENDATANG */}
            {activeTab === "UPCOMING" && (
                <div className="space-y-4">
                    {upcomingSchedules.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-8">
                            Tidak ada jadwal mendatang.
                        </p>
                    ) : (
                        upcomingSchedules.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            {formatDate(item.startTime)}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {formatTime(item.startTime, item.endTime)}
                                        </span>

                                        {/* Badge Mode Kelas */}
                                        {item.mode === "HYBRID" && (
                                            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Fleksibel (Hybrid)
                                            </span>
                                        )}
                                        {item.mode === "OFFLINE" && (
                                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Tatap Muka (Offline)
                                            </span>
                                        )}
                                        {item.mode === "ONLINE" && (
                                            <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Online
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-sm">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Pengajar:{" "}
                                        <span className="font-medium text-slate-700">
                                            {classData.teacher.fullName}
                                        </span>
                                    </p>

                                    {/* Lokasi Fisik jika Offline / Hybrid */}
                                    {(item.mode === "OFFLINE" || item.mode === "HYBRID") &&
                                        item.location && (
                                            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                <span>
                                                    Lokasi: <strong>{item.location}</strong>
                                                </span>
                                            </p>
                                        )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSession(item)}
                                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                    >
                                        Ajukan Izin
                                    </button>

                                    {(item.mode === "ONLINE" || item.mode === "HYBRID") &&
                                        item.meetingUrl && (
                                            <a
                                                href={item.meetingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
                                            >
                                                <Video className="w-3.5 h-3.5" />
                                                <span>Gabung Zoom</span>
                                            </a>
                                        )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB 2: RIWAYAT KEHADIRAN */}
            {activeTab === "HISTORY" && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {historySchedules.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-8">
                                Belum ada riwayat kehadiran.
                            </p>
                        ) : (
                            historySchedules.map((item) => {
                                const attendance = item.attendances[0];
                                const isAttended = attendance?.status === "ON_TIME" || attendance?.status === "LATE";
                                
                                return (
                                <div
                                    key={item.id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span>{formatDate(item.startTime)}</span>
                                            <span>•</span>
                                            <span>{formatTime(item.startTime, item.endTime)}</span>
                                        </div>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-slate-500">Pengajar: {classData.teacher.fullName}</p>
                                        {attendance?.note && (
                                            <p className="text-[11px] text-amber-700 italic mt-1">
                                                Catatan: {attendance.note}
                                            </p>
                                        )}
                                    </div>

                                    <div className="shrink-0">
                                        {isAttended ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                                                <XCircle className="w-3.5 h-3.5" /> {attendance?.status === "EXCUSED" ? "Izin" : "Alpa"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )})
                        )}
                    </div>
                </div>
            )}

            {/* MODAL FORM AJUKAN IZIN / SAKIT */}
            {selectedSession && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white max-w-md w-full rounded-xl border border-slate-200 p-5 space-y-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-900">
                                Form Izin / Sakit Sesi Kelas
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
                                aria-label="Tutup modal"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <p className="font-bold text-slate-900">
                                {selectedSession.title}
                            </p>
                            <p className="text-slate-500">
                                {formatDate(selectedSession.startTime)} ({formatTime(selectedSession.startTime, selectedSession.endTime)})
                            </p>
                        </div>

                        <form onSubmit={handleAbsenceSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Alasan Tidak Hadir
                                </label>
                                <textarea
                                    rows={3}
                                    value={absenceReason}
                                    onChange={(e) => setAbsenceReason(e.target.value)}
                                    placeholder="Tuliskan alasan berhalangan hadir..."
                                    required
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Unggah Bukti (Surat Dokter / Dokumen Izin)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={closeModal}
                                    className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? "Mengirim..." : "Kirim Izin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
