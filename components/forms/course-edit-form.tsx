"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseInput } from "@/schemas/course.schema";
import { updateCourse } from "@/actions/course.action";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type CourseWithRelations = Prisma.CourseGetPayload<{
    include: {
        programType: { include: { program: true } }
    }
}>;

export function CourseEditForm({ course }: { course: CourseWithRelations }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseInput>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            id: course.id,
            programTypeId: course.programTypeId,
            code: course.code,
            name: course.name,
            description: course.description,
            category: course.category,
            level: course.level,
            durationHours: course.durationHours,
            totalSessions: course.totalSessions,
            basePrice: course.basePrice ? Number(course.basePrice) : 0,
            isActive: course.isActive,
        },
    });

    const onSubmit = async (data: CourseInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateCourse(course.id, data);
            router.push(`/management/courses/${course.id}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan saat mengupdate.");
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

            {/* Readonly Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Program</label>
                    <input
                        type="text"
                        disabled
                        value={course.programType.program.name}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Program Type</label>
                    <input
                        type="text"
                        disabled
                        value={course.programType.name}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500"
                    />
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kursus *</label>
                    <input
                        type="text"
                        {...register("code")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kursus *</label>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                    <textarea
                        rows={2}
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
                    onClick={() => router.push(`/management/courses/${course.id}`)}
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
                    {isSubmitting ? "Menyimpan..." : "Update Course"}
                </button>
            </div>
        </form>
    );
}

