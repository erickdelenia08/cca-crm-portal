"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle2, X } from "lucide-react";

interface ScheduleConflict {
    hasConflict: boolean;
    conflictingClass?: {
        code: string;
        name: string;
        time: string;
    };
}

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentClassId: string;
    sessionId: string;
    sessionNumber: number;
}

export default function RescheduleModal({
    isOpen,
    onClose,
    currentClassId,
    sessionId,
    sessionNumber,
}: RescheduleModalProps) {
    const [newDate, setNewDate] = useState("2026-09-24");
    const [startTime, setStartTime] = useState("13:00");
    const [endTime, setEndTime] = useState("14:30");
    const [reason, setReason] = useState("");

    const [conflictState, setConflictState] = useState<ScheduleConflict>({
        hasConflict: false,
    });

    // Mock data semua kelas yang diampu pengajar untuk simulasi validasi
    const existingTeacherSchedules = [
        {
            classCode: "TOEFL-B05",
            className: "TOEFL iBT Preparation",
            date: "2026-09-24",
            startTime: "13:00",
            endTime: "15:00",
        },
        {
            classCode: "GE-INT-02",
            className: "General English",
            date: "2026-09-25",
            startTime: "14:00",
            endTime: "16:00",
        },
    ];

    // Efek untuk mengecek bentrok setiap kali Tanggal/Jam berubah
    useEffect(() => {
        if (!newDate || !startTime || !endTime) return;

        // Cek apakah ada jadwal lain pengajar di tanggal & jam yang sama/iris-an
        const foundConflict = existingTeacherSchedules.find((item) => {
            if (item.date !== newDate) return false;

            // Logika irisan waktu: (StartA < EndB) AND (EndA > StartB)
            const startA = startTime;
            const endA = endTime;
            const startB = item.startTime;
            const endB = item.endTime;

            return startA < endB && endA > startB;
        });

        if (foundConflict) {
            setConflictState({
                hasConflict: true,
                conflictingClass: {
                    code: foundConflict.classCode,
                    name: foundConflict.className,
                    time: `${foundConflict.startTime} - ${foundConflict.endTime} WIB`,
                },
            });
        } else {
            setConflictState({ hasConflict: false });
        }
    }, [newDate, startTime, endTime]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (conflictState.hasConflict) {
            alert("Tidak dapat menyimpan karena ada bentrok jadwal!");
            return;
        }
        alert("Jadwal pengganti berhasil disimpan!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Ubah Jadwal Pertemuan Ke-{sessionNumber}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Atur tanggal & jam pengganti khusus untuk 1 hari ini saja.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Input Tanggal */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tanggal Pengganti Baru
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            required
                            className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Input Jam */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Jam Mulai
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Jam Selesai
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Kotak Status Pengecekan Bentrok (Conflict Warning) */}
                    {conflictState.hasConflict ? (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs space-y-0.5">
                                <p className="font-bold">Jadwal Bentrok!</p>
                                <p>
                                    Anda sudah ada jadwal mengajar di kelas{" "}
                                    <span className="font-bold">
                                        {conflictState.conflictingClass?.name} ({conflictState.conflictingClass?.code})
                                    </span>{" "}
                                    pada jam {conflictState.conflictingClass?.time}.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Jadwal aman! Tidak bentrok dengan kelas Anda yang lain.</span>
                        </div>
                    )}

                    {/* Alasan Perubahan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alasan Perubahan (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Contoh: Dosen berhalangan hadir / Dosen sakit"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={conflictState.hasConflict}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl text-white transition-colors shadow-sm ${conflictState.hasConflict
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            Simpan Jadwal Pengganti
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}