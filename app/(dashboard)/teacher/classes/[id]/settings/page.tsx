"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Clock, MapPin, Calendar } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ClassSettingsPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const classId = resolvedParams.id;

    const [days, setDays] = useState<string[]>(["Senin", "Rabu"]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:30");
    const [room, setRoom] = useState("Ruang 201");

    const availableDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    const toggleDay = (day: string) => {
        setDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated Settings:", { classId, days, startTime, endTime, room });
        alert("Pengaturan jadwal berhasil diperbarui!");
    };

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Link
                    href={`/teacher/classes/${classId}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Detail Kelas
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pengaturan Jadwal Rutin
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Atur hari, jam, dan lokasi ruangan pelaksanaan kelas ini.
                </p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Pilih Hari Rutin */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                        Hari Pelaksanaan Rutin
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availableDays.map((day) => {
                            const isSelected = days.includes(day);
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSelected
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Waktu Pelaksanaan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Jam Mulai
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
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
                            className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Ruangan */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lokasi Ruangan / Laboratorium
                    </label>
                    <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan Jadwal</span>
                    </button>
                </div>
            </form>
        </div>
    );
}