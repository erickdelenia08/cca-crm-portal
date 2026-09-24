'use client';

import { useState } from 'react';
import { UserCheck, BookOpen, Users, Clock, Plus, X } from 'lucide-react';

interface Session {
    id: string;
    sessionNo: number;
    date: string;
    time: string;
    mode: string;
    location: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

interface TempTeacher {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export default function ClassDetailPage() {
    const [activeTab, setActiveTab] = useState<'sessions' | 'teachers' | 'materials' | 'students'>('sessions');

    const [sessions, setSessions] = useState<Session[]>([
        { id: 'ses_1', sessionNo: 1, date: '2026-10-05', time: '09:00 - 11:00', mode: 'OFFLINE', location: 'Lab Bahasa 1', status: 'COMPLETED' },
        { id: 'ses_2', sessionNo: 2, date: '2026-10-07', time: '09:00 - 11:00', mode: 'OFFLINE', location: 'Lab Bahasa 1', status: 'SCHEDULED' },
    ]);

    const [tempTeachers, setTempTeachers] = useState<TempTeacher[]>([]);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [teacherForm, setTeacherForm] = useState({ name: '', startDate: '', endDate: '', reason: '' });

    const handleReschedule = (sessionId: string) => {
        const newDate = prompt('Masukkan Tanggal Baru (YYYY-MM-DD):');
        if (newDate) {
            setSessions(sessions.map((s) => (s.id === sessionId ? { ...s, date: newDate } : s)));
        }
    };

    const handleAddTempTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        const newTeacher: TempTeacher = {
            id: `tt_${Date.now()}`,
            ...teacherForm,
        };
        setTempTeachers([...tempTeachers, newTeacher]);
        setIsTeacherModalOpen(false);
        setTeacherForm({ name: '', startDate: '', endDate: '', reason: '' });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                            Kelas A (Pagi)
                        </span>
                        <h1 className="text-xl font-extrabold text-slate-900 mt-1">IELTS Intensive Prep</h1>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
                        Berjalan
                    </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div>Tutor Utama: <strong>Mr. John Doe</strong></div>
                    <div>Rentang: <strong>05 Okt - 20 Nov 2026</strong></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
                {[
                    { id: 'sessions', label: 'Sesi Pertemuan (CourseSession)', icon: Clock },
                    { id: 'teachers', label: 'Guru & Pengganti (CourseClassTeacher)', icon: UserCheck },
                    { id: 'materials', label: 'Materi (CourseMaterial)', icon: BookOpen },
                    { id: 'students', label: 'Murid Terdaftar (CourseEnrollment)', icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'sessions' && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                            <tr>
                                <th className="p-2.5">Sesi Ke</th>
                                <th className="p-2.5">Tanggal & Jam</th>
                                <th className="p-2.5">Moda / Lokasi</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sessions.map((s) => (
                                <tr key={s.id}>
                                    <td className="p-2.5 font-bold">Sesi {s.sessionNo}</td>
                                    <td className="p-2.5">{s.date} ({s.time})</td>
                                    <td className="p-2.5">{s.mode} - {s.location}</td>
                                    <td className="p-2.5">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-2.5 text-right">
                                        <button onClick={() => handleReschedule(s.id)} className="text-purple-600 hover:underline font-bold">
                                            Reschedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'teachers' && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-xs">Riwayat Guru Pengganti Sementara</h3>
                        <button
                            onClick={() => setIsTeacherModalOpen(true)}
                            className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700"
                        >
                            <Plus className="w-3.5 h-3.5" /> Assign Guru Pengganti
                        </button>
                    </div>
                    {tempTeachers.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Belum ada guru pengganti sementara yang ditugaskan.</p>
                    ) : (
                        <div className="space-y-2">
                            {tempTeachers.map((tt) => (
                                <div key={tt.id} className="p-3 border rounded-lg bg-slate-50 text-xs flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-slate-800">{tt.name} (Pengganti)</div>
                                        <div className="text-slate-500">Rentang: {tt.startDate} s/d {tt.endDate}</div>
                                        <div className="text-[10px] text-slate-400 italic">Alasan: {tt.reason}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Teacher */}
            {isTeacherModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Assign Guru Pengganti</h3>
                            <button onClick={() => setIsTeacherModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAddTempTeacher} className="space-y-3">
                            <div>
                                <label className="text-[11px] font-bold text-slate-600">Nama Guru Pengganti</label>
                                <input
                                    type="text"
                                    value={teacherForm.name}
                                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                                    className="w-full border rounded-lg p-2 text-xs mt-1"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Tgl Mulai</label>
                                    <input
                                        type="date"
                                        value={teacherForm.startDate}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, startDate: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-600">Tgl Selesai</label>
                                    <input
                                        type="date"
                                        value={teacherForm.endDate}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, endDate: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-xs mt-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-600">Alasan</label>
                                <input
                                    type="text"
                                    value={teacherForm.reason}
                                    onChange={(e) => setTeacherForm({ ...teacherForm, reason: e.target.value })}
                                    className="w-full border rounded-lg p-2 text-xs mt-1"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button type="button" onClick={() => setIsTeacherModalOpen(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500">Batal</button>
                                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}