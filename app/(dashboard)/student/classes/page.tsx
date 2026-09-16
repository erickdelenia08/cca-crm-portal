"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    CheckCircle2,
    XCircle,
} from "lucide-react";

// Types eksplisit tanpa `any`
type AttendanceStatus = "ON_TIME" | "LATE" | "ABSENT_SICK" | "ABSENT_PERMIT";
type ClassMode = "ONLINE" | "OFFLINE";

interface ClassScheduleItem {
    id: string;
    title: string;
    teacher: string;
    date: string;
    time: string;
    mode: ClassMode;
    zoomLink?: string | null;
    location?: string | null;
}

interface HistoryScheduleItem extends Omit<ClassScheduleItem, "mode" | "zoomLink" | "location"> {
    attendanceStatus: AttendanceStatus;
    absenceNote?: string | null;
}

export default function ClientClassesPage() {
    const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");

    // Type state ditentukan secara eksplisit sebagai ClassScheduleItem atau null
    const [selectedScheduleForAbsence, setSelectedScheduleForAbsence] = useState<ClassScheduleItem | null>(null);
    const [absenceReason, setAbsenceReason] = useState<string>("");
    const [absenceProof, setAbsenceProof] = useState<File | null>(null);

    const classBatchInfo = {
        batchName: "IELTS Intensive Batch 12",
        program: "ENGLISH_COURSE",
        startDate: "01 Sep 2026",
        endDate: "30 Nov 2026",
        totalSessions: 24,
        completedSessions: 8,
    };

    const upcomingSchedules: ClassScheduleItem[] = [
        {
            id: "sched-1",
            title: "IELTS Writing Task 2: Essay Structure & Argumentation",
            teacher: "Ms. Sarah Jenkins",
            date: "Kamis, 10 Sep 2026",
            time: "15:30 - 17:00 WIB",
            mode: "ONLINE",
            zoomLink: "https://zoom.us/j/mocklink123",
            location: null,
        },
        {
            id: "sched-2",
            title: "IELTS Speaking Part 2 & 3: Fluency & Coherence",
            teacher: "Mr. David Miller",
            date: "Sabtu, 12 Sep 2026",
            time: "10:00 - 11:30 WIB",
            mode: "ONLINE",
            zoomLink: "https://zoom.us/j/mocklink456",
            location: null,
        },
    ];

    const historySchedules: HistoryScheduleItem[] = [
        {
            id: "sched-hist-1",
            title: "IELTS Reading: Matching Headings & True/False/Not Given",
            teacher: "Ms. Sarah Jenkins",
            date: "Selasa, 08 Sep 2026",
            time: "15:30 - 17:00 WIB",
            attendanceStatus: "ON_TIME",
            absenceNote: null,
        },
        {
            id: "sched-hist-2",
            title: "IELTS Listening: Multiple Choice & Map Labelling",
            teacher: "Mr. David Miller",
            date: "Kamis, 03 Sep 2026",
            time: "15:30 - 17:00 WIB",
            attendanceStatus: "ABSENT_SICK",
            absenceNote: "Surat Keterangan Sakit Dokter (Terverifikasi)",
        },
    ];

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAbsenceProof(e.target.files[0]);
        }
    };

    const handleAbsenceSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!absenceReason) return;

        // Payload dikirim ke API backend
        const formData = new FormData();
        if (selectedScheduleForAbsence) {
            formData.append("scheduleId", selectedScheduleForAbsence.id);
        }
        formData.append("reason", absenceReason);
        if (absenceProof) {
            formData.append("file", absenceProof);
        }

        alert("Pengajuan izin/sakit berhasil dikirim.");
        setSelectedScheduleForAbsence(null);
        setAbsenceReason("");
        setAbsenceProof(null);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
            {/* Header Info Kelas */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {classBatchInfo.program.replace("_", " ")}
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                            {classBatchInfo.batchName}
                        </h1>
                    </div>
                    <div className="text-left sm:text-right">
                        <span className="text-xs font-semibold text-slate-500">Progres Kehadiran</span>
                        <p className="text-sm font-bold text-slate-900">
                            {classBatchInfo.completedSessions} / {classBatchInfo.totalSessions} Sesi Selesai
                        </p>
                    </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{
                            width: `${(classBatchInfo.completedSessions / classBatchInfo.totalSessions) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Modern Segmented Control / Pill Switcher */}
            <div className="flex items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                        type="button"
                        onClick={() => setActiveTab("UPCOMING")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "UPCOMING"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Jadwal Mendatang
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "HISTORY"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Riwayat Kehadiran
                    </button>
                </div>

                {/* Counter Badge Opsional */}
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                    {activeTab === "UPCOMING"
                        ? `${upcomingSchedules.length} sesi mendatang`
                        : `${historySchedules.length} sesi tersimpan`}
                </span>
            </div>

            {/* TAB 1: JADWAL MENDATANG */}
            {activeTab === "UPCOMING" && (
                <div className="space-y-4">
                    {upcomingSchedules.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                        {item.date}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {item.time}
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>

                                <p className="text-xs text-slate-500">
                                    Pengajar: <span className="font-medium text-slate-700">{item.teacher}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                                <button
                                    type="button"
                                    onClick={() => setSelectedScheduleForAbsence(item)}
                                    className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                                >
                                    Ajukan Izin
                                </button>

                                {item.mode === "ONLINE" && item.zoomLink ? (
                                    <a
                                        href={item.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Masuk Zoom</span>
                                    </a>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-medium px-3 py-2 rounded-lg text-xs">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {item.location ?? "Ruang Kelas"}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 2: RIWAYAT KEHADIRAN */}
            {activeTab === "HISTORY" && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {historySchedules.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span>{item.date}</span>
                                        <span>•</span>
                                        <span>{item.time}</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{item.title}</p>
                                    <p className="text-slate-500">Pengajar: {item.teacher}</p>
                                    {item.absenceNote && (
                                        <p className="text-[11px] text-amber-700 italic mt-1">
                                            Catatan: {item.absenceNote}
                                        </p>
                                    )}
                                </div>

                                <div className="shrink-0">
                                    {item.attendanceStatus === "ON_TIME" ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                                            <XCircle className="w-3.5 h-3.5" /> Izin / Sakit
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL FORM AJUKAN IZIN / SAKIT */}
            {selectedScheduleForAbsence && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-md w-full rounded-xl border border-slate-200 p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-900">Form Izin / Sakit Sesi Kelas</h3>
                            <button
                                type="button"
                                onClick={() => setSelectedScheduleForAbsence(null)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                                Tutup
                            </button>
                        </div>

                        <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <p className="font-bold text-slate-900">{selectedScheduleForAbsence.title}</p>
                            <p className="text-slate-500">{selectedScheduleForAbsence.date} ({selectedScheduleForAbsence.time})</p>
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
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
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
                                    onClick={() => setSelectedScheduleForAbsence(null)}
                                    className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                >
                                    Kirim Izin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}