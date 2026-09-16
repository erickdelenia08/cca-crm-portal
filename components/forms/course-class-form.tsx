"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { courseClassSchema, CourseClassInput } from "@/schemas/course-class.schema";
import { upsertCourseClass } from "@/actions/course-class.action";

export function CourseClassForm({
    courseId,
    teachers,
    initialData,
    onSuccess,
    onCancel,
}: {
    courseId: string;
    teachers: { id: string; name: string }[];
    initialData?: Partial<CourseClassInput>;
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseClassInput>({
        resolver: zodResolver(courseClassSchema),
        defaultValues: {
            id: initialData?.id,
            courseId: courseId,
            code: initialData?.code || "",
            teacherId: initialData?.teacherId || (teachers.length > 0 ? teachers[0].id : ""),
            schedule: initialData?.schedule || "",
            maxCapacity: initialData?.maxCapacity || 15,
            startDate: initialData?.startDate || "",
            endDate: initialData?.endDate || "",
        },
    });

    const onSubmit = async (data: CourseClassInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await upsertCourseClass(data);
            onSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                    {error}
                </div>
            )}
            
            <input type="hidden" {...register("courseId")} />
            {initialData?.id && <input type="hidden" {...register("id")} />}

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Kelas / Batch *
                </label>
                <input
                    type="text"
                    placeholder="GER-A1-OCT24"
                    {...register("code")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pengajar Utamanya *
                </label>
                <select
                    {...register("teacherId")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
                {errors.teacherId && <span className="text-red-500 text-xs mt-1 block">{errors.teacherId.message}</span>}
                {teachers.length === 0 && <span className="text-amber-500 text-[10px] mt-1 block">Belum ada pengajar (Department ACADEMIC) terdaftar.</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jadwal Pertemuan *
                </label>
                <input
                    type="text"
                    placeholder="Senin & Rabu, 18:30 - 20:30 WIB"
                    {...register("schedule")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {errors.schedule && <span className="text-red-500 text-xs mt-1 block">{errors.schedule.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kapasitas Maksimal *
                </label>
                <input
                    type="number"
                    min={1}
                    {...register("maxCapacity")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {errors.maxCapacity && <span className="text-red-500 text-xs mt-1 block">{errors.maxCapacity.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tanggal Mulai *
                    </label>
                    <input
                        type="date"
                        {...register("startDate")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                    {errors.startDate && <span className="text-red-500 text-xs mt-1 block">{errors.startDate.message}</span>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tanggal Selesai *
                    </label>
                    <input
                        type="date"
                        {...register("endDate")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                    {errors.endDate && <span className="text-red-500 text-xs mt-1 block">{errors.endDate.message}</span>}
                </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                    {isSubmitting ? "Menyimpan..." : "Simpan Kelas"}
                </button>
            </div>
        </form>
    );
}
