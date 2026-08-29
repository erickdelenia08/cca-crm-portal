'use client';

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    BookOpen,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    X,
    AlertCircle
} from 'lucide-react';

// --- DATA DUMMY ---
const CONSULTANTS = [
    { id: '1', name: 'Dr. Ahmad Subagyo', role: 'Konselor Beasiswa & Karir' },
    { id: '2', name: 'Siti Rahmawati, M.Pd.', role: 'Tutor Matematika & Fisika' },
    { id: '3', name: 'Budi Santoso, S.T.', role: 'Tutor UTBK & TPS' },
];

const TIME_SLOTS = [
    { id: 's1', time: '09:00 - 10:00', available: true },
    { id: 's2', time: '10:30 - 11:30', available: false },
    { id: 's3', time: '13:00 - 14:00', available: true },
    { id: 's4', time: '14:30 - 15:30', available: true },
    { id: 's5', time: '16:00 - 17:00', available: false },
];

export default function StudentSchedulePage() {
    // --- STATE ---
    const [selectedConsultant, setSelectedConsultant] = useState(CONSULTANTS[0].id);
    const [sessionType, setSessionType] = useState('academic'); // 'academic' | 'counseling'
    const [selectedDate, setSelectedDate] = useState('2026-09-01');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Modal & Flow State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Handlers
    const handleOpenBooking = (slotTime: string) => {
        setSelectedSlot(slotTime);
        setIsBookingModalOpen(true);
    };

    const handleProceedToConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsBookingModalOpen(false);
        setIsConfirmModalOpen(true);
    };

    const handleFinalSubmit = () => {
        setIsConfirmModalOpen(false);
        setShowToast(true);
        setTopic('');
        setSelectedSlot(null);

        // Auto hide toast
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    };

    const activeConsultant = CONSULTANTS.find(c => c.id === selectedConsultant);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Toast Notifikasi */}
                {showToast && (
                    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
                        <CheckCircle className="w-5 h-5" />
                        <span>Pengajuan booking berhasil dikirim! Menunggu konfirmasi.</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">Jadwalkan Sesi Konsultasi & Les</h1>
                    <p className="text-gray-500 mt-1">Pilih konsultan, tanggal, dan waktu yang tersedia untuk membuat janji baru.</p>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Konsultan / Tutor</label>
                            <div className="relative">
                                <select
                                    value={selectedConsultant}
                                    onChange={(e) => setSelectedConsultant(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    {CONSULTANTS.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.role})
                                        </option>
                                    ))}
                                </select>
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Sesi</label>
                            <div className="relative">
                                <select
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="academic">Les Akademik / Mata Pelajaran</option>
                                    <option value="counseling">Konsultasi Beasiswa & Karir</option>
                                </select>
                                <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar & Slot Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Date Selector */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                            Pilih Tanggal
                        </h2>

                        {/* Simple Date Mock Navigator */}
                        <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg">
                            <button className="p-1 hover:bg-white rounded transition"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                            <span className="font-medium text-gray-700">September 2026</span>
                            <button className="p-1 hover:bg-white rounded transition"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                        </div>

                        <div className="space-y-2">
                            {[
                                { date: '2026-09-01', label: 'Selasa, 1 Sep 2026' },
                                { date: '2026-09-02', label: 'Rabu, 2 Sep 2026' },
                                { date: '2026-09-03', label: 'Kamis, 3 Sep 2026' },
                            ].map((item) => (
                                <button
                                    key={item.date}
                                    onClick={() => setSelectedDate(item.date)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition ${selectedDate === item.date
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Time Slots */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Slot Waktu Tersedia</h2>
                        <p className="text-sm text-gray-500 mb-6">Pilih slot jam yang cocok untuk mengajukan booking.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TIME_SLOTS.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`p-4 rounded-xl border flex items-center justify-between transition ${slot.available
                                        ? 'border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm'
                                        : 'border-gray-100 bg-gray-50 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock className={`w-5 h-5 ${slot.available ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <div>
                                            <p className="font-semibold text-gray-800">{slot.time}</p>
                                            <p className="text-xs text-gray-500">
                                                {slot.available ? 'Tersedia' : 'Sudah Dipesan'}
                                            </p>
                                        </div>
                                    </div>

                                    {slot.available ? (
                                        <button
                                            onClick={() => handleOpenBooking(slot.time)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                                        >
                                            Pilih
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-medium rounded">
                                            Penuh
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

            {/* --- MODAL 1: FORM BOOKING --- */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">Form Pengajuan Sesi</h3>
                            <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleProceedToConfirm} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500">Konsultan</label>
                                <p className="font-medium text-gray-800">{activeConsultant?.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border text-sm">
                                <div>
                                    <span className="text-xs text-gray-500 block">Tanggal</span>
                                    <span className="font-medium text-gray-800">{selectedDate}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Waktu</span>
                                    <span className="font-medium text-gray-800">{selectedSlot}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Sesi</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sessionTypeModal"
                                            value="academic"
                                            checked={sessionType === 'academic'}
                                            onChange={() => setSessionType('academic')}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        Les Akademik / Mata Pelajaran
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sessionTypeModal"
                                            value="counseling"
                                            checked={sessionType === 'counseling'}
                                            onChange={() => setSessionType('counseling')}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        Konsultasi Beasiswa & Karir
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Topik / Catatan Pembahasan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Contoh: Pembahasan soal kalkulus bab integrasi..."
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsBookingModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Lanjut Konfirmasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: KONFIRMASI AKHIR --- */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Konfirmasi Booking</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Apakah rincian pengajuan booking ini sudah benar?
                            </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg text-left text-xs space-y-2 border">
                            <p><span className="text-gray-500">Konsultan:</span> <strong>{activeConsultant?.name}</strong></p>
                            <p><span className="text-gray-500">Jadwal:</span> <strong>{selectedDate} ({selectedSlot})</strong></p>
                            <p><span className="text-gray-500">Topik:</span> <strong>{topic}</strong></p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setIsConfirmModalOpen(false);
                                    setIsBookingModalOpen(true);
                                }}
                                className="w-1/2 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Ubah Data
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="w-1/2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Kirim Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}