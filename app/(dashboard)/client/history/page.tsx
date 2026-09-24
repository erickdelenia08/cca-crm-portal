'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Video,
    MapPin,
    FileText,
    Star,
    X,
    Filter,
    Inbox
} from 'lucide-react';

interface Material {
    name: string;
    size: string;
    url: string;
}

interface StudentSessionHistory {
    id: string;
    date: string;
    time: string;
    subject: string;
    tutorName: string;
    sessionType: 'Online' | 'Offline';
    status: 'Completed' | 'Cancelled' | 'No-show';
    durationMinutes: number;
    attendance: 'Present' | 'Absent' | '-';
    sessionNotes: string[];
    tutorNotes?: string;
    materials?: Material[];
    feedback?: {
        rating: number;
        comment: string;
    };
}

// Data Dummy (Sorted dari yang paling terbaru)
const DUMMY_STUDENT_HISTORY: StudentSessionHistory[] = [
    {
        id: '1',
        date: '28 Aug 2026',
        time: '19:00 – 20:30 WIB',
        subject: 'Mathematics',
        tutorName: 'Mr. Andi',
        sessionType: 'Online',
        status: 'Completed',
        durationMinutes: 90,
        attendance: 'Present',
        sessionNotes: ['Quadratic equations', 'Functions & Graphs'],
        tutorNotes: 'Siswa perlu latihan lebih banyak pada materi persamaan kuadrat.',
        materials: [
            { name: 'Mathematics - Chapter 4.pdf', size: '2.4 MB', url: '#' },
            { name: 'Practice Questions.pdf', size: '1.1 MB', url: '#' },
        ],
        feedback: {
            rating: 4,
            comment: 'Penjelasan sangat jelas dan contoh soalnya relevan!',
        },
    },
    {
        id: '2',
        date: '26 Aug 2026',
        time: '19:00 – 20:30 WIB',
        subject: 'Physics',
        tutorName: 'Mr. Budi',
        sessionType: 'Offline',
        status: 'Completed',
        durationMinutes: 90,
        attendance: 'Present',
        sessionNotes: ['Newton\'s Laws of Motion', 'Friction forces'],
        tutorNotes: 'Pemahaman konsep dasar sangat baik. Siap untuk level soal tinggi.',
        materials: [
            { name: 'Physics_Lab_Notes.pdf', size: '3.8 MB', url: '#' },
        ],
        feedback: {
            rating: 5,
            comment: 'Sesi offline yang sangat membantu dalam praktik.',
        },
    },
    {
        id: '3',
        date: '20 Aug 2026',
        time: '14:00 – 15:30 WIB',
        subject: 'English',
        tutorName: 'Ms. Sarah',
        sessionType: 'Online',
        status: 'Cancelled',
        durationMinutes: 0,
        attendance: '-',
        sessionNotes: [],
        tutorNotes: 'Sesi dibatalkan oleh siswa karena sakit.',
    },
];

export default function StudentSessionHistoryPage() {
    // --- FILTER STATES ---
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [tutorFilter, setTutorFilter] = useState<string>('All');

    // --- MODAL STATE ---
    const [selectedSession, setSelectedSession] = useState<StudentSessionHistory | null>(null);

    // Daftar unik Tutor untuk Dropdown Filter
    const tutorOptions = useMemo(() => {
        const tutors = DUMMY_STUDENT_HISTORY.map((item) => item.tutorName);
        return ['All', ...Array.from(new Set(tutors))];
    }, []);

    // Filter Logic
    const filteredSessions = useMemo(() => {
        return DUMMY_STUDENT_HISTORY.filter((session) => {
            const matchStatus = statusFilter === 'All' || session.status === statusFilter;
            const matchType = typeFilter === 'All' || session.sessionType === typeFilter;
            const matchTutor = tutorFilter === 'All' || session.tutorName === tutorFilter;
            return matchStatus && matchType && matchTutor;
        });
    }, [statusFilter, typeFilter, tutorFilter]);

    // Keyboard Event listener untuk menutup Modal via tombol ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedSession(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Riwayat Sesi Selesai</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Rekam jejak sesi belajar dan konsultasi yang telah kamu ikuti beserta materi dan umpan balik.
                </p>
            </div>

            {/* Control Panel: Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Filter Sesi</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Filter Status */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Status Sesi</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="All">Semua Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No-show">No-show</option>
                        </select>
                    </div>

                    {/* Filter Jenis Sesi */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Jenis Sesi</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="All">Semua Mode (Online & Offline)</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>

                    {/* Filter Tutor */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Tutor / Konsultan</label>
                        <select
                            value={tutorFilter}
                            onChange={(e) => setTutorFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {tutorOptions.map((tutor) => (
                                <option key={tutor} value={tutor}>
                                    {tutor === 'All' ? 'Semua Tutor' : tutor}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Session List / Empty State */}
            {filteredSessions.length === 0 ? (
                /* Empty State Component */
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                        <Inbox className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">Tidak ada riwayat sesi</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                        Tidak ditemukan riwayat sesi yang sesuai dengan kriteria filter yang kamu pilih.
                    </p>
                </div>
            ) : (
                /* Session List Cards */
                <div className="space-y-3">
                    {filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {session.date}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {session.time}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-800">{session.subject}</h2>

                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                    <span className="flex items-center gap-1 font-medium text-gray-700">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        {session.tutorName}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        {session.sessionType === 'Online' ? (
                                            <Video className="w-3.5 h-3.5 text-blue-500" />
                                        ) : (
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                        )}
                                        {session.sessionType}
                                    </span>
                                </div>
                            </div>

                            {/* Status Badge & Actions */}
                            <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${session.status === 'Completed'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : session.status === 'Cancelled'
                                                ? 'bg-rose-100 text-rose-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}
                                >
                                    {session.status}
                                </span>

                                <button
                                    onClick={() => setSelectedSession(session)}
                                    className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors border border-gray-200"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- DETAIL MODAL (READ-ONLY) --- */}
            {selectedSession && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedSession(null)}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-gray-800 rounded-2xl border border-gray-200 w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{selectedSession.subject}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {selectedSession.date} · {selectedSession.time}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5 overflow-y-auto text-xs">

                            {/* Meta Stats */}
                            <div className="grid grid-cols-3 gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Tutor</span>
                                    <span className="font-semibold text-gray-700">{selectedSession.tutorName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Status Sesi</span>
                                    <span className="font-semibold text-gray-700">{selectedSession.status}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Kehadiran</span>
                                    <span className="font-semibold text-gray-700">{selectedSession.attendance}</span>
                                </div>
                            </div>

                            {/* Notes & Topic */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-sm text-gray-800">Catatan Pembahasan Sesi</h3>

                                {selectedSession.sessionNotes.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 block mb-1">Topik yang dibahas:</span>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium pl-1">
                                            {selectedSession.sessionNotes.map((topic, index) => (
                                                <li key={index}>{topic}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedSession.tutorNotes && (
                                    <div>
                                        <span className="text-gray-500 block mb-1">Catatan Tambahan dari Tutor:</span>
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed border border-gray-200">
                                            {selectedSession.tutorNotes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-100" />

                            {/* Materials Download */}
                            <div>
                                <h3 className="font-bold text-sm text-gray-800 mb-2">Materi / Berkas Pembelajaran</h3>
                                {selectedSession.materials && selectedSession.materials.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedSession.materials.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={file.url}
                                                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-blue-50/50 hover:border-blue-200 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                    <span className="font-medium text-gray-700 group-hover:text-blue-600">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-400">{file.size}</span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Tidak ada berkas yang dilampirkan.</p>
                                )}
                            </div>

                            <hr className="border-gray-100" />

                            {/* Feedback */}
                            <div>
                                <h3 className="font-bold text-sm text-gray-800 mb-2">Ulasan / Feedback Siswa</h3>
                                {selectedSession.feedback ? (
                                    <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 space-y-1">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < selectedSession.feedback!.rating
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="italic text-gray-700 mt-1">
                                            &ldquo;{selectedSession.feedback.comment}&rdquo;
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Belum ada ulasan yang diberikan untuk sesi ini.</p>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-xs hover:bg-gray-300 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}