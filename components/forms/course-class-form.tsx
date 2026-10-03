"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { courseClassSchema, CourseClassInput } from "@/schemas/course-class.schema";
import { createCourseClass } from "@/actions/course-class.action";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CourseClassForm({
    courseId,
    teachers,
    initialData,
    onSuccess,
    onCancel,
}: {
    courseId: string;
    teachers: { id: string; name: string }[];
    initialData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseClassInput>({
        resolver: zodResolver(courseClassSchema),
        defaultValues: initialData || {
            courseId,
            code: "",
            name: "",
            maxCapacity: 10,
            startDate: new Date().toISOString().split("T")[0] as unknown as Date,
            endDate: new Date().toISOString().split("T")[0] as unknown as Date,
            isActive: true,
            patterns: [
                {
                    dayOfWeek: 1,
                    startTime: "10:00",
                    endTime: "12:00",
                    defaultMode: "OFFLINE",
                    defaultLocation: "",
                }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "patterns",
    });

    const onSubmit = async (data: CourseClassInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createCourseClass(data);
            router.push(`/management/courses/${courseId}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white rounded-xl shadow-sm border border-gray-200">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kelas / Batch *</label>
                    <input
                        type="text"
                        placeholder="e.g. ENG-BATCH-01"
                        {...register("code")}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kelas (Opsional)</label>
                    <input
                        type="text"
                        placeholder="e.g. Intensive Morning A"
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
                                {t.name}
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
                        {...register("maxCapacity")}
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

            {/* Schedule Patterns Section */}
            <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Jadwal Rutin (Schedule Patterns)</h3>
                        <p className="text-xs text-slate-500">Jadwal ini akan digunakan untuk men-generate sesi secara otomatis dari tanggal mulai hingga selesai.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ dayOfWeek: 1, startTime: "10:00", endTime: "12:00", defaultMode: "OFFLINE", defaultLocation: "" })}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Jadwal
                    </button>
                </div>

                {errors.patterns?.root && (
                    <span className="text-red-500 text-xs block mb-2">{errors.patterns.root.message}</span>
                )}

                <div className="space-y-3">
                    {fields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="col-span-12 md:col-span-3">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hari</label>
                                <select
                                    {...register(`patterns.${index}.dayOfWeek`)}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                >
                                    <option value={1}>Senin</option>
                                    <option value={2}>Selasa</option>
                                    <option value={3}>Rabu</option>
                                    <option value={4}>Kamis</option>
                                    <option value={5}>Jumat</option>
                                    <option value={6}>Sabtu</option>
                                    <option value={0}>Minggu</option>
                                </select>
                            </div>
                            <div className="col-span-6 md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mulai</label>
                                <input
                                    type="time"
                                    {...register(`patterns.${index}.startTime`)}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                            <div className="col-span-6 md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Selesai</label>
                                <input
                                    type="time"
                                    {...register(`patterns.${index}.endTime`)}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mode</label>
                                <select
                                    {...register(`patterns.${index}.defaultMode`)}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                >
                                    <option value="OFFLINE">Offline</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div className="col-span-10 md:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lokasi/Link</label>
                                <input
                                    type="text"
                                    placeholder="Room 101"
                                    {...register(`patterns.${index}.defaultLocation`)}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100 disabled:opacity-30 transition-colors"
                                    title="Hapus Jadwal"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => onCancel ? onCancel() : router.push(`/management/courses/${courseId}`)}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                    {isSubmitting ? "Menyimpan..." : "Buat Kelas & Generate Sesi"}
                </button>
            </div>
        </form>
    );
}
