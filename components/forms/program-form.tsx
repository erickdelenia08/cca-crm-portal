"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Globe,
    FileCheck,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programSchema, ProgramInput } from "@/schemas/program.schema";
import { createProgram } from "@/actions/program.action";

interface ProgramType {
    id: string;
    name: string;
    code: string;
}

const DESTINATIONS = [
    { value: "AUSTRALIA", label: "Australia" },
    { value: "CHINA", label: "China" },
    { value: "JAPAN", label: "Jepang" },
    { value: "NEW_ZEALAND", label: "New Zealand" },
    { value: "KOREA", label: "Korea Selatan" },
];

const createRequirementCode = (label: string) => {
    return label
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 50);
};

export function ProgramForm({ programTypes }: { programTypes: ProgramType[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ProgramInput>({
        resolver: zodResolver(programSchema),
        defaultValues: {
            name: "",
            typeId: "",
            destination: "",
            basePrice: 0,
            description: "",
            isActive: true,
            documentRequirements: [
                {
                    code: "PASSPORT",
                    name: "Paspor Aktif",
                    description: "Halaman identitas harus terlihat jelas dan masih berlaku.",
                    isRequired: true,
                },
                {
                    code: "CV",
                    name: "Curriculum Vitae (CV)",
                    description: "Gunakan CV terbaru dan dalam format PDF.",
                    isRequired: true,
                },
                {
                    code: "ENGLISH_CERTIFICATE",
                    name: "Sertifikat Bahasa Inggris (IELTS/PTE)",
                    description: "Contoh: IELTS minimal 4.5 overall / PTE minimal 30.",
                    isRequired: true,
                },
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "documentRequirements"
    });

    const onSubmit = async (data: ProgramInput) => {
        setIsSubmitting(true);
        try {
            await createProgram(data);
            alert("Program berhasil dibuat!");
            router.push("/management/programs");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Buat Master Program Baru
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Tambahkan layanan konsultasi beserta persyaratan dokumen.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Program
                </button>
            </div>

            {/* SECTION 1: INFORMASI PROGRAM */}
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Informasi Program
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* NAMA PROGRAM */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Nama Program <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name")}
                            placeholder="Contoh: Working Holiday Visa Australia"
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        <p className="mt-1 text-[11px] text-gray-400">
                            Gunakan nama layanan, bukan nama batch atau periode.
                        </p>
                    </div>

                    {/* TIPE PROGRAM */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Tipe Program <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("typeId")}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pilih tipe program</option>
                            {programTypes.map((pt) => (
                                <option key={pt.id} value={pt.id}>{pt.name}</option>
                            ))}
                        </select>
                        {errors.typeId && <p className="mt-1 text-xs text-red-500">{errors.typeId.message}</p>}
                    </div>

                    {/* DESTINATION */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Negara Tujuan <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("destination")}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pilih negara tujuan</option>
                            {DESTINATIONS.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                        {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination.message}</p>}
                    </div>

                    {/* BASE PRICE */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Biaya Jasa Dasar (IDR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-sm font-medium text-gray-400">Rp</span>
                            <input
                                type="number"
                                {...register("basePrice", { valueAsNumber: true })}
                                min={0}
                                step={1000}
                                placeholder="15000000"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice.message}</p>}
                        <p className="mt-1 text-[11px] text-gray-400">Masukkan biaya jasa utama program.</p>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Deskripsi Program
                        </label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            placeholder="Penjelasan mengenai program..."
                            className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* ACTIVE */}
                    <div className="md:col-span-2">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs font-medium text-gray-700">Program aktif</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION 2: DOCUMENT REQUIREMENTS */}
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                            <FileCheck className="h-5 w-5 text-blue-600" />
                            Dokumen Persyaratan Program
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Tentukan checklist dokumen yang harus dipenuhi student untuk program ini.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ code: "", name: "", description: "", isRequired: true })}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                    >
                        <Plus className="h-4 w-4" /> Tambah Berkas
                    </button>
                </div>

                {errors.documentRequirements && (
                    <p className="text-sm text-red-500">{errors.documentRequirements.message}</p>
                )}

                {fields.length === 0 ? (
                    <div className="space-y-1 rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                        <AlertCircle className="mx-auto h-5 w-5 text-gray-300" />
                        <p>Belum ada dokumen persyaratan.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
                                        Dokumen #{index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="rounded p-1 text-gray-400 transition-colors hover:text-red-600"
                                        title="Hapus Dokumen"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                    <div className="md:col-span-7">
                                        <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                                            Nama Dokumen <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register(`documentRequirements.${index}.name`)}
                                            onChange={(e) => {
                                                setValue(`documentRequirements.${index}.name`, e.target.value);
                                                const currentCode = watch(`documentRequirements.${index}.code`);
                                                if (!currentCode) {
                                                    setValue(`documentRequirements.${index}.code`, createRequirementCode(e.target.value));
                                                }
                                            }}
                                            placeholder="Contoh: Ijazah Terakhir"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                        />
                                        {errors.documentRequirements?.[index]?.name && (
                                            <p className="mt-1 text-xs text-red-500">{errors.documentRequirements[index]?.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-5">
                                        <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                                            Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register(`documentRequirements.${index}.code`)}
                                            placeholder="IJAZAH"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-mono uppercase"
                                        />
                                        {errors.documentRequirements?.[index]?.code && (
                                            <p className="mt-1 text-xs text-red-500">{errors.documentRequirements[index]?.code?.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-12">
                                        <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                                            Deskripsi Persyaratan
                                        </label>
                                        <input
                                            {...register(`documentRequirements.${index}.description`)}
                                            placeholder="Keterangan tambahan format atau isi dokumen (opsional)"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                        />
                                    </div>
                                    <div className="md:col-span-12">
                                        <label className="inline-flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register(`documentRequirements.${index}.isRequired`)}
                                                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-[11px] font-medium text-gray-700">Wajib diunggah (Mandatory)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
}
