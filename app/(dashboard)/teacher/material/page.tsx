"use client";

import { useState } from "react";
import { Upload, FileText, Music, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Material {
    id: string;
    title: string;
    className: string;
    type: "PDF" | "AUDIO";
    fileSize: string;
    uploadedAt: string;
}

export default function TeacherMaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([
        {
            id: "m1",
            title: "IELTS Writing Task 2 Template & Vocabulary.pdf",
            className: "IELTS Intensive - Batch 3",
            type: "PDF",
            fileSize: "2.4 MB",
            uploadedAt: "08 Sep 2026",
        },
        {
            id: "m2",
            title: "Academic Listening Lecture Track 04.mp3",
            className: "TOEFL Prep - Class A1",
            type: "AUDIO",
            fileSize: "12.8 MB",
            uploadedAt: "07 Sep 2026",
        },
    ]);

    const [title, setTitle] = useState("");
    const [selectedClass, setSelectedClass] = useState("IELTS Intensive - Batch 3");
    const [fileType, setFileType] = useState<"PDF" | "AUDIO">("PDF");

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const newMat: Material = {
            id: `m-${Date.now()}`,
            title: title.endsWith(".pdf") || title.endsWith(".mp3") ? title : `${title}.${fileType === "PDF" ? "pdf" : "mp3"}`,
            className: selectedClass,
            type: fileType,
            fileSize: "1.8 MB",
            uploadedAt: "Hari Ini",
        };

        setMaterials([newMat, ...materials]);
        setTitle("");
    };

    const handleDelete = (id: string) => {
        setMaterials(materials.filter((m) => m.id !== id));
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Materi Ajar & Penugasan PR
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Upload materi PDF/Audio listening dan bagikan modul ke portal siswa.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Upload */}
                <div className="lg:col-span-1">
                    <form
                        onSubmit={handleUpload}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-6"
                    >
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Upload Materi Baru
                        </h2>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Target Kelas Batch
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="IELTS Intensive - Batch 3">IELTS Intensive - Batch 3</option>
                                <option value="TOEFL Prep - Class A1">TOEFL Prep - Class A1</option>
                                <option value="HSK Level 4 - Express">HSK Level 4 - Express</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Judul Materi / File
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Modul Listening Section 1"
                                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Format Berkas
                            </label>
                            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setFileType("PDF")}
                                    className={`py-2 rounded-lg border transition-all ${fileType === "PDF"
                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                            : "border-slate-200 text-slate-600"
                                        }`}
                                >
                                    PDF Document
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFileType("AUDIO")}
                                    className={`py-2 rounded-lg border transition-all ${fileType === "AUDIO"
                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                            : "border-slate-200 text-slate-600"
                                        }`}
                                >
                                    Audio (MP3)
                                </button>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-700">Drag & Drop file di sini</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Maksimal ukuran file: 25MB</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
                        >
                            Simpan & Unggah
                        </button>
                    </form>
                </div>

                {/* List Berkas Terunggah */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Daftar Materi Terunggah</h2>

                    <div className="space-y-3">
                        {materials.map((m) => (
                            <div
                                key={m.id}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-lg ${m.type === "PDF" ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-600"}`}>
                                        {m.type === "PDF" ? <FileText className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900">{m.title}</h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            {m.className} • {m.fileSize} • {m.uploadedAt}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(m.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}