"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createUserSchema, CreateUserInput } from "@/schemas/user.schema";
import { createUser } from "@/actions/user.action";
import { Role } from "@prisma/client";
import { Key, CheckCircle2 } from "lucide-react";


export function CreateUserForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: "STUDENT",
            name: "",
            email: "",
        }
    });

    const role = watch("role");
    
    // Auto generate mock ID for display
    const prefix = role === "STUDENT" ? "STD" : role === "TEACHER" ? "TCH" : role === "CONSULTANT" ? "CST" : "STF";
    const generatedId = `CCA-2026-${prefix}-XXXX`;

    const onSubmit = async (data: CreateUserInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createUser(data);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Peran Akses (Role)</label>
                <select
                    {...register("role")}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-bold"
                >
                    <option value="STUDENT">Siswa / Klien</option>
                    <option value="TEACHER">Guru (Teacher)</option>
                    <option value="CONSULTANT">Konsultan Beasiswa/Visa</option>
                    <option value="DOCUMENT_PROCESSOR">Processor Dept.</option>
                    <option value="ADMIN_MANAGEMENT">Admin Portal</option>
                </select>
                {errors.role && <span className="text-red-500 text-xs mt-1 block">{errors.role.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Auto-Generated System ID</label>
                <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        disabled
                        value={generatedId}
                        className="w-full pl-9 bg-slate-100 border border-slate-300 text-blue-700 font-mono font-bold text-xs rounded-lg p-2.5"
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">ID asli akan di-generate oleh sistem saat disimpan.</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                    {...register("name")}
                    placeholder="Nama lengkap pengguna..."
                    className="bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Resmi</label>
                <input
                    type="email"
                    {...register("email")}
                    placeholder="email@example.com"
                    className="bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-medium"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div className="pt-2 flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                    disabled={isSubmitting}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                    disabled={isSubmitting}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 
                    {isSubmitting ? "Menyimpan..." : "Simpan Akun"}
                </button>
            </div>
        </form>
    );
}
