"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  FileText,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { saveSessionNotes } from "@/actions/booking.action";

export interface SessionDetailData {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  program: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingUrl?: string | null;
  studentNotes?: string | null;
  existingNotes?: string;
  existingActionItems?: { id: string; text: string; done: boolean }[];
}

interface SessionDetailClientProps {
  sessionData: SessionDetailData;
}

export function SessionDetailClient({ sessionData }: SessionDetailClientProps) {
  const [notes, setNotes] = useState(sessionData.existingNotes || "");
  const [actionItems, setActionItems] = useState<{ id: string; text: string; done: boolean }[]>(
    sessionData.existingActionItems || []
  );
  const [newItemText, setNewItemText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setActionItems([
      ...actionItems,
      { id: Date.now().toString(), text: newItemText, done: false },
    ]);
    setNewItemText("");
  };

  const handleToggleItem = (id: string) => {
    setActionItems(
      actionItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  const handleSaveSession = async () => {
    setIsSaving(true);
    try {
      const res = await saveSessionNotes(sessionData.id, notes, actionItems);
      if (res?.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert(res?.error || "Gagal menyimpan catatan.");
      }
    } catch (error) {
      console.error("Error saving notes", error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/consultant/sessions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Sesi
        </Link>
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          ID Sesi: #{sessionData.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {sessionData.program}
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                  {sessionData.topic}
                </h1>
              </div>

              {sessionData.meetingUrl && (
                <a
                  href={sessionData.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  Masuk Room Meeting
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {sessionData.studentNotes && (
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  📌 Catatan Pengajuan dari Siswa:
                </span>
                &ldquo;{sessionData.studentNotes}&rdquo;
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Catatan Hasil Bimbingan
              </h2>
              {isSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                </span>
              )}
            </div>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan poin penting, kelebihan, atau kekurangan siswa selama sesi..."
              className="w-full text-xs font-medium p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />

            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-900 mb-2">
                Action Items / Tugas Lanjutan Siswa:
              </h3>
              <div className="space-y-2 mb-3">
                {actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleItem(item.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={
                          item.done
                            ? "line-through text-slate-400"
                            : "text-slate-800 font-medium"
                        }
                      >
                        {item.text}
                      </span>
                    </label>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddActionItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="+ Tambah tugas baru untuk siswa..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveSession}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Menyimpan..." : "Simpan Catatan & Finish Sesi"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              Info Siswa
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {sessionData.studentName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-slate-800">
                  {sessionData.studentEmail}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Waktu Sesi:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {sessionData.date}
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {sessionData.startTime} - {sessionData.endTime} WIB
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href={`/consultant/students/${sessionData.studentId}`}
                className="w-full inline-flex justify-center items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 px-3 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Portfolio Siswa Ini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
