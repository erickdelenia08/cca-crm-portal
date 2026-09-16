"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Tag, Save, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { programTypeSchema, ProgramTypeInput } from '@/schemas/program-type.schema';
import { upsertProgramType } from '@/actions/program-type.action';

export function ProgramTypeForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProgramTypeInput>({
        resolver: zodResolver(programTypeSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            isActive: true,
        },
    });

    const currentCode = watch('code');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('name', value);

        if (!currentCode || currentCode === value.substring(0, value.length - 1).trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')) {
            const generatedCode = value
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
            setValue('code', generatedCode);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCode = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
        setValue('code', formattedCode);
    };

    const onSubmit = async (data: ProgramTypeInput) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await upsertProgramType(data);
            router.push('/management/program-types');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || 'Terjadi kesalahan saat menyimpan data.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Buat Program Type
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tambahkan kategori atau jenis program baru ke dalam sistem.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Type'}
                </button>

            </div>

            {/* ==================================================
                MAIN FORM
            ================================================== */}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50">
                        <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Informasi Program Type
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Data ini akan digunakan saat membuat master program.
                        </p>
                    </div>
                </div>

                <div className="space-y-5">

                    {/* NAME */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Nama Program Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Working Holiday Visa"
                            {...register('name')}
                            onChange={handleNameChange}
                            className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                        <p className="text-[11px] text-gray-400 mt-1.5">
                            Nama yang akan ditampilkan kepada Management dan Consultant.
                        </p>
                    </div>

                    {/* CODE */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: WHV"
                            maxLength={50}
                            {...register('code')}
                            onChange={handleCodeChange}
                            className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono uppercase"
                        />
                        {errors.code && <span className="text-red-500 text-xs mt-1 block">{errors.code.message}</span>}
                        <p className="text-[11px] text-gray-400 mt-1.5">
                            Code digunakan sebagai identifier internal. Contoh: WHV, STUDY_ABROAD.
                        </p>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Deskripsi
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Contoh: Program layanan Working Holiday Visa untuk membantu client mempersiapkan proses WHV ke negara tujuan."
                            {...register('description')}
                            className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                        {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('isActive', { setValueAs: (v) => v === 'true' })}
                            className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <p className="text-[11px] text-gray-400 mt-1.5">
                            Program type inactive tidak akan tersedia saat membuat program baru.
                        </p>
                    </div>

                </div>
            </div>

            {/* ==================================================
                INFO BOX
            ================================================== */}

            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-semibold text-blue-900">
                        Contoh Program Type
                    </p>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        WHV, Study Abroad, Visa Consulting, Internship Abroad, atau kategori layanan lain yang memang digunakan oleh CCA.
                    </p>
                </div>
            </div>

            {/* ==================================================
                BOTTOM ACTION
            ================================================== */}

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Program Type'}
                </button>
            </div>

        </form>
    );
}
