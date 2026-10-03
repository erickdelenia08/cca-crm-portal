"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseInput } from "@/schemas/course.schema";
import { createCourse } from "@/actions/course.action";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type ProgramWithTypes = Prisma.ProgramGetPayload<{
    include: { programTypes: true }
}>;

export function CourseCreateWizard({ programs }: { programs: ProgramWithTypes[] }) {
    const router = useRouter();
    const [selectedProgramId, setSelectedProgramId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeProgram = programs.find(p => p.id === selectedProgramId);
    const availableProgramTypes = activeProgram?.programTypes || [];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseInput>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            code: "",
            name: "",
            category: "LANGUAGE",
            level: "BASIC",
            durationHours: 0,
            totalSessions: 0,
            basePrice: 0,
            isActive: true,
        },
    });

    const onSubmit = async (data: CourseInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createCourse(data);
            router.push("/management/courses");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan saat menyimpan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Step 1: Program & Program Type Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program (Brand) *</label>
                    <select
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Program --</option>
                        {programs.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program Type (Product) *</label>
                    <select
                        {...register("programTypeId")}
                        disabled={!selectedProgramId}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Program Type --</option>
                        {availableProgramTypes.map(pt => (
                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                        ))}
                    </select>
                    {errors.programTypeId && <span className="text-red-500 text-xs mt-1 block">{errors.programTypeId.message}</span>}
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6"></div>

            {/* Step 2: Course Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kursus *</label>
                    <input
                        type="text"
                        placeholder="Contoh: EN-BASIC"
                        {...register("code")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kursus *</label>
                    <input
                        type="text"
                        placeholder="Contoh: English Basic"
                        {...register("name")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                    <textarea
                        rows={2}
                        placeholder="Penjelasan tentang course ini..."
                        {...register("description")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                    <select
                        {...register("category")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Optional --</option>
                        <option value="LANGUAGE">LANGUAGE</option>
                        <option value="ACADEMIC">ACADEMIC</option>
                        <option value="SKILL">SKILL</option>
                        <option value="ORIENTATION">ORIENTATION</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Level</label>
                    <select
                        {...register("level")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Optional --</option>
                        <option value="BASIC">BASIC</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="PREPARATION">PREPARATION</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Total (Jam)</label>
                    <input
                        type="number"
                        min={0}
                        {...register("durationHours")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Pertemuan (Sesi)</label>
                    <input
                        type="number"
                        min={0}
                        {...register("totalSessions")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Dasar (Base Price)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">Rp</span>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            {...register("basePrice")}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 pl-9 text-sm focus:ring-2 focus:ring-blue-500 font-semibold"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button
                    type="button"
                    onClick={() => router.push("/management/courses")}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                    {isSubmitting ? "Menyimpan..." : "Buat Course"}
                </button>
            </div>
        </form>
    );
}
