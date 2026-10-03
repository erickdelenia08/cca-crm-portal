"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Target,
    FileCheck,
    FileClock,
    Plus,
    MessageSquare,
    Calendar,
} from "lucide-react";
import { addClientNote } from "@/actions/booking.action";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    academic: string;
    // preferences: string;
}

interface DocumentData {
    id: string;
    name: string;
    status: string; // "APPROVED", "SUBMITTED", "NOT_UPLOADED" etc.
    date: string;
}

interface NoteData {
    id: string;
    date: string;
    author: string;
    content: string;
}

interface ClientDetailClientProps {
    profile: ProfileData;
    documents: DocumentData[];
    initialNotes: NoteData[];
}

export function ClientDetailClient({ profile, documents, initialNotes }: ClientDetailClientProps) {
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState<NoteData[]>(initialNotes);
    const [isSaving, setIsSaving] = useState(false);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setIsSaving(true);
        try {
            const res = await addClientNote(profile.id, newNote);
            if (res?.success) {
                const today = new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const newEntry = {
                    id: Date.now().toString(),
                    date: today,
                    author: "Konsultan",
                    content: newNote,
                };

                setNotes([newEntry, ...notes]);
                setNewNote("");
            } else {
                alert(res?.error || "Gagal menyimpan catatan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/consultant/clients"
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {profile.name}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        ID: {profile.id} • Status: <span className="font-semibold text-emerald-600">Aktif</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                            Profil Klien
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                {profile.phone || "Tidak ada nomor"}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                {profile.location || "Tidak ada lokasi"}
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <GraduationCap className="w-4 h-4 text-slate-500" /> Riwayat Akademik
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {profile.academic || "Belum ada riwayat akademik."}
                                </p>
                            </div>
                            {/* <div className="pt-3 mt-3 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <Target className="w-4 h-4 text-slate-500" /> Preferensi & Target
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {profile.preferences || "Belum ada preferensi."}
                                </p>
                            </div> */}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                            Status Dokumen (Read-only)
                        </h2>
                        <div className="space-y-3">
                            {documents.length > 0 ? documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                                >
                                    <div className="flex items-center gap-2.5">
                                        {doc.status === "APPROVED" ? (
                                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        ) : (
                                            <FileClock className="w-4 h-4 text-amber-500 shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">
                                                {doc.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500">{doc.date}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.status === "APPROVED"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {doc.status === "APPROVED" ? "Disetujui" : (doc.status === "NOT_UPLOADED" ? "Belum Upload" : "Pending")}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-500">Belum ada dokumen yang dipersyaratkan.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <h2 className="text-base font-bold text-slate-900">
                                Meeting Notes & Log Interaksi
                            </h2>
                        </div>

                        <form
                            onSubmit={handleAddNote}
                            className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200"
                        >
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                Tambah Catatan Baru
                            </label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                placeholder="Tulis catatan, ringkasan, atau log interaksi dengan klien..."
                                className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
                            ></textarea>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!newNote.trim() || isSaving}
                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" /> {isSaving ? "Menyimpan..." : "Simpan Catatan"}
                                </button>
                            </div>
                        </form>

                        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                            {notes.length > 0 ? notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="relative pl-4 border-l-2 border-slate-200"
                                >
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-xs">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-800">
                                                {note.author}
                                            </span>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                <Calendar className="w-3 h-3" /> {note.date}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {note.content}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-500 text-center py-4">Belum ada catatan interaksi.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
