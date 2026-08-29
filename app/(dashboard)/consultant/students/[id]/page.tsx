"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, MapPin, GraduationCap, Target,
    FileCheck, FileClock, Plus, MessageSquare, Calendar
} from "lucide-react";

export default function StudentDetailPage() {
    const [newNote, setNewNote] = useState("");

    // Mock Data Profil
    const profile = {
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62 812-3456-7890",
        location: "Jakarta, Indonesia",
        academic: "S1 Teknik Informatika, Institut Teknologi Bandung (GPA: 3.8/4.0)",
        preferences: "Fokus ke universitas di Jerman (TU Munich, RWTH Aachen). Perlu bantuan intensif di Motivation Letter.",
    };

    // Mock Data Dokumen (Read-Only)
    const documents = [
        { id: 1, name: "Curriculum Vitae (CV)", status: "verified", date: "20 Agu 2026" },
        { id: 2, name: "Ijazah & Transkrip", status: "verified", date: "21 Agu 2026" },
        { id: 3, name: "Motivation Letter (Draft 1)", status: "pending", date: "Menunggu Siswa" },
        { id: 4, name: "Sertifikat IELTS/TOEFL", status: "verified", date: "15 Agu 2026" },
    ];

    // Mock Data Meeting Notes
    const [notes, setNotes] = useState([
        { id: 1, date: "28 Agu 2026", author: "Konsultan", content: "Review CV selesai. Struktur sudah bagus, hanya perlu penekanan di pengalaman proyek akhir. PR untuk Budi: Mulai draft poin-poin Motivation Letter." },
        { id: 2, date: "20 Agu 2026", author: "Konsultan", content: "Sesi kickoff. Menentukan timeline pendaftaran dan shortlist universitas (TUM & RWTH). Budi berjanji upload transkrip besok." },
    ]);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        const newEntry = {
            id: Date.now(),
            date: "29 Agu 2026", // Current Date Mock
            author: "Konsultan",
            content: newNote,
        };
        setNotes([newEntry, ...notes]);
        setNewNote("");
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/consultant/students" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{profile.name}</h1>
                    <p className="text-sm text-slate-500 mt-0.5">ID: S001 • Status: Aktif</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kolom Kiri: Profil & Status Dokumen */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Card Profil */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Profil Siswa</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {profile.phone}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {profile.location}
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <GraduationCap className="w-4 h-4 text-slate-500" /> Riwayat Akademik
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{profile.academic}</p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <Target className="w-4 h-4 text-slate-500" /> Preferensi & Target
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{profile.preferences}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Status Dokumen (Read-Only) */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                            Status Dokumen (Read-only)
                        </h2>
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        {doc.status === "verified" ? (
                                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        ) : (
                                            <FileClock className="w-4 h-4 text-amber-500 shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{doc.name}</p>
                                            <p className="text-[10px] text-slate-500">{doc.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                        }`}>
                                        {doc.status === "verified" ? "Lengkap" : "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Meeting Notes */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <h2 className="text-base font-bold text-slate-900">Meeting Notes & Log Interaksi</h2>
                        </div>

                        {/* Form Tambah Catatan */}
                        <form onSubmit={handleAddNote} className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                Tambah Catatan Sesi Baru
                            </label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                placeholder="Tulis ringkasan meeting, progress, atau PR untuk siswa..."
                                className="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:outline-hidden focus:border-blue-500 resize-none mb-3"
                            ></textarea>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!newNote.trim()}
                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-2xs"
                                >
                                    <Plus className="w-4 h-4" /> Simpan Catatan
                                </button>
                            </div>
                        </form>

                        {/* Timeline Log Catatan */}
                        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                            {notes.map((note) => (
                                <div key={note.id} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-xs">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-800">{note.author}</span>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                <Calendar className="w-3 h-3" /> {note.date}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {note.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}