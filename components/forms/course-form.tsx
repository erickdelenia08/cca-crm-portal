"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { courseSchema, CourseInput } from "@/schemas/course.schema";
import { upsertCourse } from "@/actions/course.action";

export function CourseForm({
    initialData,
    onSuccess,
    onCancel,
}: {
    initialData?: CourseInput;
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseInput>({
        resolver: zodResolver(courseSchema),
        defaultValues: initialData || {
            code: "",
            name: "",
            category: "LANGUAGE",
            level: "BASIC",
            durationHours: 0,
            basePrice: 0,
            isActive: true,
        },
    });

    const onSubmit = async (data: CourseInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await upsertCourse(data);
            onSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                    {error}
                </div>
            )}

            {/* Hidden field for ID if editing */}
            {initialData?.id && <input type="hidden" {...register("id")} />}

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kursus *</label>
                <input
                    type="text"
                    placeholder="GER-A1"
                    {...register("code")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
                {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kursus *</label>
                <input
                    type="text"
                    placeholder="Bahasa Jerman Level A1"
                    {...register("name")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                    <select
                        {...register("category")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold"
                    >
                        <option value="LANGUAGE">LANGUAGE</option>
                        <option value="ACADEMIC">ACADEMIC</option>
                        <option value="SKILL">SKILL</option>
                        <option value="ORIENTATION">ORIENTATION</option>
                    </select>
                    {errors.category && <span className="text-red-500 text-xs mt-1 block">{errors.category.message}</span>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Level</label>
                    <select
                        {...register("level")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold"
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="PREPARATION">PREPARATION</option>
                    </select>
                    {errors.level && <span className="text-red-500 text-xs mt-1 block">{errors.level.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi (Jam)</label>
                    <input
                        type="number"
                        min={0}
                        {...register("durationHours")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                    />
                    {errors.durationHours && <span className="text-red-500 text-xs mt-1 block">{errors.durationHours.message}</span>}
                </div>

                {/* Input Base Price */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Harga Dasar (Base Price) *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                            Rp
                        </span>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="2500000"
                            {...register("basePrice")}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 pl-8 text-sm font-semibold text-slate-800"
                        />
                    </div>
                    {errors.basePrice && <span className="text-red-500 text-xs mt-1 block">{errors.basePrice.message}</span>}
                </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
            </div>
        </form>
    );
}
