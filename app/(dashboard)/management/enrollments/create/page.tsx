'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    UserCheck,
    Globe,
    PlusCircle,
    Search,
    User2,
    CheckCircle2,
    BookOpen,
    Check
} from 'lucide-react';

// --- Mock Database ---
const MOCK_STUDENTS = [
    { id: 'std-1', name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '081234567890' },
    { id: 'std-2', name: 'Siti Rahma', email: 'siti.rahma@gmail.com', phone: '089876543210' },
    { id: 'std-3', name: 'Andi Pratama', email: 'andi.p@gmail.com', phone: '085612347890' },
];

const MOCK_CONSULTANTS = [
    { id: 'cons-1', name: 'Sarah Wijaya, M.Ed.', role: 'Senior WHV Specialist' },
    { id: 'cons-2', name: 'Rian Hidayat', role: 'China Study Abroad Advisor' },
    { id: 'cons-3', name: 'Jessica Tan', role: 'General Visa & Education Consultant' },
];

const MOCK_PROGRAMS = [
    { id: 'p1', title: 'Working Holiday Visa (WHV) Australia', type: 'VISA_HOLIDAY_WHV', price: 15000000, description: 'Pengurusan SKCK, Bank Statement, & Submit Visa WHV' },
    { id: 'p2', title: 'Study Abroad China - Bachelor Degree', type: 'STUDY_ABROAD', price: 20000000, description: 'Aplikasi Beasiswa & Kampus di Tiongkok' },
    { id: 'p3', title: 'Ausbildung Jerman - Student Visa', type: 'STUDY_ABROAD', price: 25000000, description: 'Pendampingan Kontrak Kerja & Visa Ausbildung' },
];

const MOCK_ADDON_COURSES = [
    { id: 'c1', title: 'IELTS Intensive Preparation', price: 3500000, duration: '2 Bulan / 16 Sesi' },
    { id: 'c2', title: 'Basic Conversation English', price: 2000000, duration: '1 Bulan / 8 Sesi' },
    { id: 'c3', title: 'Mandarin HSK 3 Preparation', price: 4000000, duration: '2 Bulan / 20 Sesi' },
];

export default function CreateEnrollmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultProgramId = searchParams ? searchParams.get('programId') : null;

    // --- Form States ---
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedProgramId, setSelectedProgramId] = useState(defaultProgramId || MOCK_PROGRAMS[0].id);
    const [selectedConsultantId, setSelectedConsultantId] = useState('');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    const currentStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    const currentProgram = MOCK_PROGRAMS.find(p => p.id === selectedProgramId);
    const currentConsultant = MOCK_CONSULTANTS.find(c => c.id === selectedConsultantId);

    // Toggle Add-on Course
    const handleToggleAddon = (courseId: string) => {
        if (selectedAddons.includes(courseId)) {
            setSelectedAddons(selectedAddons.filter(id => id !== courseId));
        } else {
            setSelectedAddons([...selectedAddons, courseId]);
        }
    };

    // Hitung Total Transaksi
    const programPrice = currentProgram?.price || 0;
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
        const item = MOCK_ADDON_COURSES.find(a => a.id === addonId);
        return sum + (item?.price || 0);
    }, 0);

    const grandTotal = programPrice + addonsTotal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedProgramId || !selectedConsultantId) {
            alert('Mohon lengkapi data Student, Program Utama, dan Konsultan!');
            return;
        }

        const payload = {
            studentId: selectedStudentId,
            programId: selectedProgramId,
            consultantId: selectedConsultantId,
            addonCourseIds: selectedAddons,
            totalAmount: grandTotal,
            notes: notes
        };

        console.log('Submit Enrollment Payload:', payload);
        alert('Pendaftaran Student Ke Program Berhasil!');
        router.push('/management/enrollments');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Tombol Kembali */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Batal & Kembali
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Student ke Program</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Daftarkan student ke program utama, tentukan Konsultan (PIC), dan tambahkan paket kursus tambahan jika ada.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Form (Left 2 Cols) */}
                    <div className="md:col-span-2 space-y-6">

                        {/* 1. Pilih Student */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <UserCheck className="w-5 h-5 text-blue-600" /> 1. Pilih Student
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Cari Nama / Email Student <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={selectedStudentId}
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">-- Pilih Student dari Database --</option>
                                        {MOCK_STUDENTS.map((std) => (
                                            <option key={std.id} value={std.id}>
                                                {std.name} — ({std.email})
                                            </option>
                                        ))}
                                    </select>
                                    <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Pilih Program Utama */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Globe className="w-5 h-5 text-blue-600" /> 2. Pilih Program Layanan Utama
                            </h2>

                            <div className="space-y-3">
                                {MOCK_PROGRAMS.map((prog) => {
                                    const isSelected = selectedProgramId === prog.id;
                                    return (
                                        <div
                                            key={prog.id}
                                            onClick={() => setSelectedProgramId(prog.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isSelected
                                                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        {prog.type}
                                                    </span>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-sm">{prog.title}</h3>
                                                <p className="text-xs text-gray-500">{prog.description}</p>
                                            </div>
                                            <span className="font-bold text-sm text-gray-900 whitespace-nowrap ml-4">
                                                Rp {prog.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Add-On Courses Opsional */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-600" /> 3. Add-On Course (Opsional)
                                </h2>
                                <span className="text-xs text-gray-400">Pilihan Kursus Tambahan</span>
                            </div>

                            <div className="space-y-3">
                                {MOCK_ADDON_COURSES.map((addon) => {
                                    const isChecked = selectedAddons.includes(addon.id);

                                    return (
                                        <div
                                            key={addon.id}
                                            onClick={() => handleToggleAddon(addon.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isChecked
                                                ? 'border-blue-600 bg-blue-50/20'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'
                                                    }`}>
                                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{addon.title}</p>
                                                    <p className="text-xs text-gray-500">{addon.duration}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700">
                                                + Rp {addon.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Penugasan Konsultan (PIC) & Catatan */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <User2 className="w-5 h-5 text-blue-600" /> 4. Penugasan Konsultan (PIC)
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Konsultan Visa / Program <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={selectedConsultantId}
                                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">-- Pilih Konsultan Pendamping --</option>
                                    {MOCK_CONSULTANTS.map((cons) => (
                                        <option key={cons.id} value={cons.id}>
                                            {cons.name} ({cons.role})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-gray-500 mt-1">Konsultan ini akan bertanggung jawab mendampingi proses dokumen & visa student.</p>
                            </div>

                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Catatan Pendaftaran (Opsional)</label>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Contoh: Pembayaran DP 50%, target berangkat Oktober 2026..."
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Ringkasan & Submit (Right 1 Col) */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
                            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                                Ringkasan Transaksi
                            </h2>

                            <div className="space-y-3 text-xs text-gray-600">
                                <div>
                                    <span className="text-gray-400 block">Student Terpilih:</span>
                                    <span className="font-bold text-gray-900 text-sm">
                                        {currentStudent ? currentStudent.name : '- Belum Dipilih -'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-gray-400 block">Konsultan (PIC):</span>
                                    <span className="font-semibold text-blue-700">
                                        {currentConsultant ? currentConsultant.name : '- Belum Dipilih -'}
                                    </span>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-400">Program Utama:</span>
                                    <span className="font-semibold text-gray-900">
                                        Rp {programPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                {selectedAddons.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Add-On ({selectedAddons.length}):</span>
                                        <span className="font-semibold text-gray-900">
                                            + Rp {addonsTotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-900">Total Biaya</span>
                                <span className="text-lg font-extrabold text-blue-600">
                                    Rp {grandTotal.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedStudentId || !selectedProgramId || !selectedConsultantId}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" /> Simpan Pendaftaran
                            </button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    );
}