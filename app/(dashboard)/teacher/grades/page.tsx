"use client";

import { useState } from "react";
import {
    BarChart3,
    Award,
    Save,
    TrendingUp,
    CheckCircle,
    BookOpen
} from "lucide-react";

interface StudentScore {
    studentId: string;
    studentName: string;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
}

export default function TeacherGradesPage() {
    const [selectedClass, setSelectedClass] = useState("IELTS-INT-B3");
    const [testType, setTestType] = useState("IELTS");
    const [testTitle, setTestTitle] = useState("Simulation Test #2");

    // Mock Data Siswa dalam Kelas
    const [students, setStudents] = useState<StudentScore[]>([
        { studentId: "std1", studentName: "Aditya Pratama", listening: 6.5, reading: 7.0, writing: 6.0, speaking: 6.5 },
        { studentId: "std2", studentName: "Siti Rahmawati", listening: 7.0, reading: 7.5, writing: 6.5, speaking: 7.0 },
        { studentId: "std3", studentName: "Budi Santoso", listening: 5.5, reading: 6.0, writing: 5.5, speaking: 5.5 },
    ]);

    // Handler update skor per komponen
    const handleScoreChange = (id: string, field: keyof StudentScore, val: string) => {
        const numVal = parseFloat(val) || 0;
        setStudents((prev) =>
            prev.map((s) => (s.studentId === id ? { ...s, [field]: numVal } : s))
        );
    };

    // Helper Hitung Overall Band Score IELTS
    const calculateIeltsOverall = (l: number, r: number, w: number, s: number) => {
        const avg = (l + r + w + s) / 4;
        return (Math.round(avg * 2) / 2).toFixed(1); // Pembulatan khas IELTS ke 0.5 terdekat
    };

    const handleSaveGrades = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Nilai ${testTitle} berhasil disimpan & grafik perkembangan portal siswa di-update!`);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Input Nilai Tryout & Simulation Test
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Masukkan skor tes simulasi siswa. Nilai ini akan dikalkulasi menjadi grafik perkembangan di portal klien.
                </p>
            </div>

            {/* Filter & Form Header */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Kelas Batch</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="IELTS-INT-B3">IELTS Intensive - Batch 3</option>
                        <option value="TOEFL-PREP-A1">TOEFL iBT Prep - Class A1</option>
                        <option value="HSK4-EXP-B1">HSK Level 4 - Express</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenis Sertifikasi / Tes</label>
                    <select
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="IELTS">IELTS Academic / General</option>
                        <option value="TOEFL">TOEFL iBT</option>
                        <option value="HSK">HSK Chinese Test</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Sesi Simulation Test</label>
                    <input
                        type="text"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        placeholder="Contoh: Simulation Test #2"
                        className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table Input Nilai */}
            <form onSubmit={handleSaveGrades} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <h2 className="text-sm font-bold text-slate-900">Form Input Lembar Nilai Siswa</h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Format Skor: 0.0 - 9.0</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                                <th className="p-4">Nama Siswa</th>
                                <th className="p-4 text-center w-28">Listening</th>
                                <th className="p-4 text-center w-28">Reading</th>
                                <th className="p-4 text-center w-28">Writing</th>
                                <th className="p-4 text-center w-28">Speaking</th>
                                <th className="p-4 text-center w-32">Overall Band</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
                            {students.map((student) => {
                                const overall = calculateIeltsOverall(
                                    student.listening,
                                    student.reading,
                                    student.writing,
                                    student.speaking
                                );

                                return (
                                    <tr key={student.studentId} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{student.studentName}</td>

                                        {/* Listening */}
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="9"
                                                value={student.listening}
                                                onChange={(e) => handleScoreChange(student.studentId, "listening", e.target.value)}
                                                className="w-16 text-center border border-slate-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 font-bold"
                                            />
                                        </td>

                                        {/* Reading */}
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="9"
                                                value={student.reading}
                                                onChange={(e) => handleScoreChange(student.studentId, "reading", e.target.value)}
                                                className="w-16 text-center border border-slate-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 font-bold"
                                            />
                                        </td>

                                        {/* Writing */}
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="9"
                                                value={student.writing}
                                                onChange={(e) => handleScoreChange(student.studentId, "writing", e.target.value)}
                                                className="w-16 text-center border border-slate-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 font-bold"
                                            />
                                        </td>

                                        {/* Speaking */}
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="9"
                                                value={student.speaking}
                                                onChange={(e) => handleScoreChange(student.studentId, "speaking", e.target.value)}
                                                className="w-16 text-center border border-slate-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 font-bold"
                                            />
                                        </td>

                                        {/* Auto-Calculated Overall */}
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center gap-1 font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                {overall}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Action Button */}
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Nilai otomatis di-sinkronisasi ke portal grafik siswa setelah disimpan.
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        Simpan & Publikasikan Nilai
                    </button>
                </div>
            </form>
        </div>
    );
}