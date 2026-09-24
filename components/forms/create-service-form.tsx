"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Globe,
    GraduationCap,
    Briefcase,
    Plus,
    Trash2,
    FileText,
    BookOpen,
    Save,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { unifiedServiceSchema, UnifiedServiceInput } from "@/schemas/program.schema";
import { createUnifiedService, getProgramFormData } from "@/actions/program.action";

type ProgramFormData = Awaited<ReturnType<typeof getProgramFormData>>;

export function CreateServiceForm({
    programs,
    programTypes,
}: ProgramFormData) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dapatkan ID program berdasarkan code ("ccabroad", "ccadvisory", "ccacademy")
    const getProgramIdByCode = (code: string) => {
        const found = programs.find((p) => p.code.toLowerCase() === code);
        return found ? found.id : "";
    };

    const form = useForm<UnifiedServiceInput>({
        resolver: zodResolver(unifiedServiceSchema),
        defaultValues: {
            category: "PROGRAM",
            programId: getProgramIdByCode("ccabroad"),
            programTypeId: "",
            name: "",
            code: "",
            description: "",
            basePrice: 0,
            documentRequirements: [
                { name: "Paspor Aktif", isRequired: true },
                { name: "KTP / Identitas Diri", isRequired: true }
            ],
            level: "BASIC",
            durationHours: 0,
        },
    });

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form;

    const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
        control,
        name: "documentRequirements",
    });

    const category = watch("category");
    const programId = watch("programId");

    // Dapatkan program types spesifik untuk CCACADEMY course creation
    const ccacademyProgramTypes = useMemo(() => {
        return programTypes.filter((pt) => pt.program.code.toLowerCase() === "ccacademy");
    }, [programTypes]);

    const onSubmit = async (data: UnifiedServiceInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await createUnifiedService(data);
            if (res.success) {
                router.push("/management/services");
            }
        } catch (err: any) {
            setError(err.message || "Gagal membuat servis");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <Link href="/management/services" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Katalog
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Servis / Layanan Baru</h1>
                    <p className="text-sm text-gray-500">Buat program pengurusan dokumen atau kelas pelatihan baru untuk CCA.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* LANGKAH 1: PILIH DIVISI & KATEGORI SERVIS */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Pilih Divisi Utama (Brand)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Option CCABROAD */}
                        <div
                            onClick={() => {
                                setValue("category", "PROGRAM", { shouldValidate: true });
                                setValue("programId", getProgramIdByCode("ccabroad"), { shouldValidate: true });
                            }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${category === "PROGRAM" && programId === getProgramIdByCode("ccabroad")
                                ? "border-blue-600 bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">CCABROAD</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Study Overseas, Visitor Visa</p>
                            </div>
                        </div>

                        {/* Option CCADVISORY */}
                        <div
                            onClick={() => {
                                setValue("category", "PROGRAM", { shouldValidate: true });
                                setValue("programId", getProgramIdByCode("ccadvisory"), { shouldValidate: true });
                            }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${category === "PROGRAM" && programId === getProgramIdByCode("ccadvisory")
                                ? "border-blue-600 bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">CCADVISORY</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Finance & Protection</p>
                            </div>
                        </div>

                        {/* Option CCACADEMY */}
                        <div
                            onClick={() => {
                                setValue("category", "COURSE", { shouldValidate: true });
                                setValue("programId", getProgramIdByCode("ccacademy"), { shouldValidate: true });
                            }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${category === "COURSE" && programId === getProgramIdByCode("ccacademy")
                                ? "border-blue-600 bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">CCACADEMY</h3>
                                <p className="text-xs text-gray-500 mt-0.5">English, Mandarin & Study Tour</p>
                            </div>
                        </div>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    {errors.programId && <p className="text-red-500 text-xs mt-1">{errors.programId.message}</p>}
                </div>

                {/* LANGKAH 2: INFORMASI DASAR SERVIS */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                        <FileText className="w-4 h-4 text-gray-500" /> Informasi Umum Servis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nama Servis / Layanan <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder={category === "PROGRAM" ? "Contoh: Student Visa Australia" : "Contoh: IELTS Preparation Class"}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Kode Kode / Unique ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("code")}
                                type="text"
                                placeholder="Contoh: VISA-AUS-01 / IELTS-PREP"
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Jelaskan detail mengenai servis atau layanan ini..."
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Biaya Dasar (Base Price - IDR)
                        </label>
                        <input
                            {...register("basePrice", { valueAsNumber: true })}
                            type="number"
                            placeholder="0"
                            className="w-full md:w-1/2 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
                    </div>
                </div>

                {/* LANGKAH 3: DYNAMIC SECTION */}

                {/* PROGRAM (CCABROAD / CCADVISORY) -> SETTING DOKUMEN */}
                {category === "PROGRAM" && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" /> Checklist Syarat Dokumen Pendaftaran
                            </h2>
                            <button
                                type="button"
                                onClick={() => appendDoc({ name: "", isRequired: true })}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Dokumen
                            </button>
                        </div>

                        <p className="text-xs text-gray-500">
                            Dokumen-dokumen ini wajib diunggah oleh siswa saat mengajukan pendaftaran servis ini.
                        </p>

                        <div className="space-y-3">
                            {docFields.map((field, idx) => (
                                <div key={field.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <input
                                        {...register(`documentRequirements.${idx}.name` as const)}
                                        type="text"
                                        placeholder="Nama dokumen (misal: Paspor, Ijazah)"
                                        className="flex-1 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                    />
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                        <input
                                            {...register(`documentRequirements.${idx}.isRequired` as const)}
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Wajib
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeDoc(idx)}
                                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COURSE (CCACADEMY) -> SETTING KELAS */}
                {category === "COURSE" && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                            <BookOpen className="w-4 h-4 text-emerald-600" /> Konfigurasi Modul & Kelas
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tipe Program (Program Type) <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("programTypeId")}
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="">-- Pilih Tipe Program --</option>
                                    {ccacademyProgramTypes.map((pt) => (
                                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                                    ))}
                                </select>
                                {errors.programTypeId && <p className="text-red-500 text-xs mt-1">{errors.programTypeId.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tingkat / Level Kursus
                                </label>
                                <select
                                    {...register("level")}
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="BASIC">Basic / Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="PREPARATION">Preparation / Intensive</option>
                                </select>
                                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Total Durasi (Jam)
                                </label>
                                <input
                                    {...register("durationHours", { valueAsNumber: true })}
                                    type="number"
                                    placeholder="Contoh: 24"
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors.durationHours && <p className="text-red-500 text-xs mt-1">{errors.durationHours.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* TOMBOL ACTION */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Link
                        href="/management/services"
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? "Menyimpan..." : "Simpan Servis"}
                    </button>
                </div>
            </form>
        </div>
    );
}