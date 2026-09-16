"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Save,
    CheckCircle2,
    Eye,
    X,
    ExternalLink,
    Calendar
} from "lucide-react";

interface Student {
    id: string;
    studentId: string;
    name: string;
    status: string;
    permitReason?: string;
    permitProofUrl?: string;
}

export default function ClassAttendancePage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params menggunakan `use()` di Next.js App Router
    const resolvedParams = use(params);
    const classId = resolvedParams.id;

    const [searchQuery, setSearchQuery] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [selectedProof, setSelectedProof] = useState<{
        name: string;
        reason?: string;
        proofUrl?: string;
    } | null>(null);

    const [students, setStudents] = useState<Student[]>([
        { id: "s1", name: "Budi Santoso", studentId: "CCA-2026-000001", status: "HADIR" },
        { id: "s2", name: "Siti Rahma", studentId: "CCA-2026-000002", status: "HADIR" },
        {
            id: "s3",
            name: "Andi Pratama",
            studentId: "CCA-2026-000003",
            status: "IZIN",
            permitReason: "Menghadiri Acara Keluarga di Luar Kota",
            permitProofUrl: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "s4",
            name: "Dewi Lestari",
            studentId: "CCA-2026-000004",
            status: "SAKIT",
            permitReason: "Demam Tinggi (Surat Dokter Terlampir)",
            permitProofUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
        },
        { id: "s5", name: "Rian Hidayat", studentId: "CCA-2026-000005", status: "ALPA" },
    ]);

    const handleStatusChange = (id: string, newStatus: string) => {
        setIsSaved(false);
        setStudents((prev) =>
            prev.map((student) => (student.id === id ? { ...student, status: newStatus } : student))
        );
    };

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto relative">
            {/* Top Navigation & Breadcrumb */}
            <div>
                <Link
                    href="/teacher/classes"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-3"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Kelas
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Kelas</h1>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md font-mono">
                                {classId.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            IELTS Intensive - Batch 12 • Pertemuan Sesi 4
                        </p>
                    </div>

                    {isSaved && (
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Absensi Berhasil Disimpan!
                        </div>
                    )}
                </div>
            </div>

            {/* Control Panel (Tanggal & Simpan) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="w-full sm:w-auto">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Tanggal Sesi Kelas
                        </label>
                        <input
                            type="date"
                            defaultValue="2026-09-09"
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2 w-full sm:w-auto focus:ring-blue-500 font-medium"
                        />
                    </div>
                </div>

                <button
                    onClick={() => setIsSaved(true)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-2xs"
                >
                    <Save className="w-4 h-4" />
                    <span>Simpan Presensi Kelas</span>
                </button>
            </div>

            {/* Tabel Daftar Siswa */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-slate-800">Daftar Siswa Kelas</h2>
                    <div className="relative w-full sm:w-60">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama / ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 text-xs rounded-lg w-full focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">ID Siswa</th>
                                <th className="px-6 py-3">Nama Lengkap</th>
                                <th className="px-6 py-3 text-center">Status Kehadiran</th>
                                <th className="px-6 py-3 text-center">Bukti Izin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">
                                        {student.studentId}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>

                                    {/* Pilihan Status */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-1.5">
                                            {["HADIR", "IZIN", "SAKIT", "ALPA"].map((statusOption) => (
                                                <button
                                                    key={statusOption}
                                                    onClick={() => handleStatusChange(student.id, statusOption)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${student.status === statusOption
                                                        ? statusOption === "HADIR"
                                                            ? "bg-emerald-600 text-white border-emerald-600"
                                                            : statusOption === "IZIN"
                                                                ? "bg-amber-500 text-white border-amber-500"
                                                                : statusOption === "SAKIT"
                                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                                    : "bg-rose-600 text-white border-rose-600"
                                                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    {statusOption}
                                                </button>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Tombol Lihat Bukti */}
                                    <td className="px-6 py-4 text-center">
                                        {(student.status === "IZIN" || student.status === "SAKIT") && student.permitProofUrl ? (
                                            <button
                                                onClick={() =>
                                                    setSelectedProof({
                                                        name: student.name,
                                                        reason: student.permitReason,
                                                        proofUrl: student.permitProofUrl,
                                                    })
                                                }
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pop-up Modal Lihat Bukti */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-4">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Bukti Perizinan Siswa</h3>
                                <p className="text-xs text-slate-500">{selectedProof.name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Keterangan:
                                </label>
                                <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
                                    {selectedProof.reason || "Tidak ada keterangan."}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Dokumen / Surat Dokter:
                                </label>
                                {selectedProof.proofUrl && (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
                                        <img
                                            src={selectedProof.proofUrl}
                                            alt="Bukti Izin"
                                            className="object-cover w-full h-full"
                                        />
                                        <a
                                            href={selectedProof.proofUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Buka Ukuran Penuh
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
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