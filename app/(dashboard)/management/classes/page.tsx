'use client';

import { useState } from 'react';
import { Plus, Calendar, UserCheck, Users, X, Trash2 } from 'lucide-react';

// DUMMY MASTER DATA DATABASE (Akan diambil dari API Prisma/Backend)
const MASTER_COURSES = [
    { id: 'crs_1', name: 'IELTS Intensive Prep' },
    { id: 'crs_2', name: 'General English Speaking' },
    { id: 'crs_3', name: 'Academic Writing Masterclass' },
];

const MASTER_INSTRUCTORS = [
    { id: 'ins_1', name: 'Mr. John Doe, M.Pd.' },
    { id: 'ins_2', name: 'Ms. Sarah Connor, B.A.' },
    { id: 'ins_3', name: 'Dr. Ahmad Dahlan' },
];

const MASTER_ROOMS = [
    { id: 'rm_1', name: 'Lab Bahasa 1 (Offline)' },
    { id: 'rm_2', name: 'Ruang Teori 202 (Offline)' },
    { id: 'rm_3', name: 'Zoom Meeting Room A (Online)' },
    { id: 'rm_4', name: 'Zoom Meeting Room B (Online)' },
];

interface SchedulePattern {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomId: string;
}

interface ClassCohort {
    id: string;
    courseName: string;
    batchName: string;
    startDate: string;
    endDate: string;
    instructorName: string;
    enrolledStudents: number;
    maxQuota: number;
    schedules: SchedulePattern[];
}

export default function ActiveClassesPage() {
    const [classes, setClasses] = useState<ClassCohort[]>([
        {
            id: 'cls_1',
            courseName: 'IELTS Intensive Prep',
            batchName: 'Kelas A (Pagi)',
            startDate: '2026-10-05',
            endDate: '2026-11-20',
            instructorName: 'Mr. John Doe, M.Pd.',
            enrolledStudents: 12,
            maxQuota: 15,
            schedules: [
                { dayOfWeek: 'Senin', startTime: '09:00', endTime: '11:00', roomId: 'Lab Bahasa 1 (Offline)' },
            ],
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classForm, setClassForm] = useState({
        courseId: MASTER_COURSES[0].id,
        batchName: '',
        instructorId: MASTER_INSTRUCTORS[0].id,
        startDate: '',
        endDate: '',
        maxQuota: 15,
    });

    const [schedules, setSchedules] = useState<SchedulePattern[]>([
        { dayOfWeek: 'Senin', startTime: '09:00', endTime: '11:00', roomId: MASTER_ROOMS[0].name },
    ]);

    const handleCreateClass = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCourse = MASTER_COURSES.find((c) => c.id === classForm.courseId);
        const selectedInstructor = MASTER_INSTRUCTORS.find((i) => i.id === classForm.instructorId);

        const newClass: ClassCohort = {
            id: `cls_${Date.now()}`,
            courseName: selectedCourse?.name || '',
            batchName: classForm.batchName,
            startDate: classForm.startDate,
            endDate: classForm.endDate,
            instructorName: selectedInstructor?.name || '',
            enrolledStudents: 0,
            maxQuota: classForm.maxQuota,
            schedules: schedules,
        };

        setClasses([...classes, newClass]);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Operasional Class & Rombel</h1>
                    <p className="text-xs text-slate-500">Penjadwalan rombel terintegrasi dengan Master Data</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                >
                    <Plus className="w-4 h-4" /> Buka Rombel Baru
                </button>
            </div>

            {/* Grid Rombel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 relative shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                    {item.batchName}
                                </span>
                                <h3 className="font-bold text-slate-900 mt-1">{item.courseName}</h3>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                                <span>Pengajar: <strong>{item.instructorName}</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-3.5 h-3.5 text-blue-600 mt-0.5" />
                                <div>
                                    <span className="font-semibold block">Pola Jadwal & Ruang:</span>
                                    {item.schedules.map((s, idx) => (
                                        <div key={idx} className="text-[11px] text-slate-500">
                                            • {s.dayOfWeek} ({s.startTime}-{s.endTime}) - {s.roomId}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 text-xs border-t border-slate-100">
                            <div className="flex items-center gap-1 font-semibold text-slate-700">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.enrolledStudents} / {item.maxQuota} Murid</span>
                            </div>
                            <a href={`/management/classes/${item.id}`} className="text-xs font-bold text-purple-600 hover:underline">
                                Kelola Detail &rarr;
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Modal Buka Rombel Baru */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Buka Rombel Baru (CourseClass)</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleCreateClass} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-600">Pilih Master Course</label>
                                <select
                                    value={classForm.courseId}
                                    onChange={(e) => setClassForm({ ...classForm, courseId: e.target.value })}
                                    className="w-full border rounded-lg p-2 text-xs font-bold text-slate-800 mt-1"
                                >
                                    {MASTER_COURSES.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Nama Batch / Periode</label>
                                    <input
                                        type="text"
                                        value={classForm.batchName}
                                        onChange={(e) => setClassForm({ ...classForm, batchName: e.target.value })}
                                        placeholder="e.g. Batch 12 (Pagi)"
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Instruktur / Tutor Utama</label>
                                    <select
                                        value={classForm.instructorId}
                                        onChange={(e) => setClassForm({ ...classForm, instructorId: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-xs font-bold text-slate-800 mt-1"
                                    >
                                        {MASTER_INSTRUCTORS.map((i) => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Tgl Mulai</label>
                                    <input
                                        type="date"
                                        value={classForm.startDate}
                                        onChange={(e) => setClassForm({ ...classForm, startDate: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Tgl Selesai</label>
                                    <input
                                        type="date"
                                        value={classForm.endDate}
                                        onChange={(e) => setClassForm({ ...classForm, endDate: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Kuota Maksimal</label>
                                    <input
                                        type="number"
                                        value={classForm.maxQuota}
                                        onChange={(e) => setClassForm({ ...classForm, maxQuota: Number(e.target.value) })}
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Pola Jadwal Hari dan Ruangan Dropdown */}
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700">Pola Jadwal Mingguan & Lokasi Ruang</span>
                                </div>
                                {schedules.map((pat, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border">
                                        <select
                                            value={pat.dayOfWeek}
                                            onChange={(e) => {
                                                const updated = [...schedules];
                                                updated[idx].dayOfWeek = e.target.value;
                                                setSchedules(updated);
                                            }}
                                            className="border rounded p-1 text-xs"
                                        >
                                            <option value="Senin">Senin</option>
                                            <option value="Selasa">Selasa</option>
                                            <option value="Rabu">Rabu</option>
                                            <option value="Kamis">Kamis</option>
                                            <option value="Jumat">Jumat</option>
                                            <option value="Sabtu">Sabtu</option>
                                        </select>
                                        <input
                                            type="time"
                                            value={pat.startTime}
                                            onChange={(e) => {
                                                const updated = [...schedules];
                                                updated[idx].startTime = e.target.value;
                                                setSchedules(updated);
                                            }}
                                            className="border rounded p-1 text-xs"
                                        />
                                        <input
                                            type="time"
                                            value={pat.endTime}
                                            onChange={(e) => {
                                                const updated = [...schedules];
                                                updated[idx].endTime = e.target.value;
                                                setSchedules(updated);
                                            }}
                                            className="border rounded p-1 text-xs"
                                        />
                                        <select
                                            value={pat.roomId}
                                            onChange={(e) => {
                                                const updated = [...schedules];
                                                updated[idx].roomId = e.target.value;
                                                setSchedules(updated);
                                            }}
                                            className="border rounded p-1 text-xs flex-1 font-medium"
                                        >
                                            {MASTER_ROOMS.map((r) => (
                                                <option key={r.id} value={r.name}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500">Batal</button>
                                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Simpan & Buka Rombel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}