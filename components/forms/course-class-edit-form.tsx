"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseClassSchema, CourseClassInput } from "@/schemas/course-class.schema";
import { updateCourseClass } from "@/actions/course-class.action";
import { useRouter } from "next/navigation";
import { CourseClass } from "@prisma/client";


export function CourseClassEditForm({
    courseClass,
    teachers,
}: {
    courseClass: CourseClass;
    teachers: { id: string; user: { name: string | null } }[];
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(courseClassSchema),
        defaultValues: {
            courseId: courseClass.courseId,
            code: courseClass.code,
            name: courseClass.name || "",
            maxCapacity: courseClass.maxCapacity,
            // startDate: new Date(courseClass.startDate).toISOString().split("T")[0] as unknown as Date,
            // endDate: new Date(courseClass.endDate).toISOString().split("T")[0] as unknown as Date,
            startDate: new Date(courseClass.startDate)
                .toISOString()
                .split("T")[0],

            endDate: new Date(courseClass.endDate)
                .toISOString()
                .split("T")[0],
            isActive: courseClass.isActive,
            teacherId: courseClass.teacherId,
            patterns: [], // Empty since we edit patterns on a separate tab
        },
    });

    const onSubmit = async (data: CourseClassInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateCourseClass(courseClass.id, data);
            router.push(`/management/courses/${courseClass.courseId}/classes/${courseClass.id}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan");
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kelas / Batch *</label>
                    <input
                        type="text"
                        {...register("code")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kelas (Opsional)</label>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pengajar Utama *</label>
                    <select
                        {...register("teacherId")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Pilih Pengajar</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.user.name}
                            </option>
                        ))}
                    </select>
                    {errors.teacherId && <span className="text-red-500 text-xs mt-1 block">{errors.teacherId.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas Maksimal</label>
                    <input
                        type="number"
                        min={1}
                        // {...register("maxCapacity")}
                        {...register("maxCapacity", {
                            valueAsNumber: true,
                        })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.maxCapacity && <span className="text-red-500 text-xs mt-1 block">{errors.maxCapacity.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai *</label>
                    <input
                        type="date"
                        {...register("startDate")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.startDate && <span className="text-red-500 text-xs mt-1 block">{errors.startDate.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai *</label>
                    <input
                        type="date"
                        {...register("endDate")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.endDate && <span className="text-red-500 text-xs mt-1 block">{errors.endDate.message}</span>}
                </div>
            </div>

            <div className="pt-5 flex justify-end gap-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.push(`/management/courses/${courseClass.courseId}/classes/${courseClass.id}`)}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                    {isSubmitting ? "Menyimpan..." : "Update Kelas"}
                </button>
            </div>
        </form>
    );
}
