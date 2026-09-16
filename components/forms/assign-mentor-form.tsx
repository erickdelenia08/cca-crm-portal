"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { assignMentorSchema, AssignMentorInput } from "@/schemas/user.schema";
import { assignMentor } from "@/actions/user.action";
import { UserCheck } from "lucide-react";
import { UserItem } from "../tables/user-table";

interface Mentor {
    id: string;
    name: string | null;
    role: string;
}

interface AssignMentorFormProps {
    student: UserItem;
    mentors: Mentor[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function AssignMentorForm({ student, mentors, onSuccess, onCancel }: AssignMentorFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AssignMentorInput>({
        resolver: zodResolver(assignMentorSchema),
        defaultValues: {
            studentId: student.id,
            consultantId: "",
        }
    });

    const onSubmit = async (data: AssignMentorInput) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await assignMentor(data);
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

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Siswa / Klien Target:</span>
                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                <p className="text-[11px] text-blue-700 font-mono font-semibold">{student.autoId}</p>
            </div>

            <input type="hidden" {...register("studentId")} />

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Mentor (Teacher / Consultant)</label>
                <select
                    {...register("consultantId")}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 w-full focus:ring-blue-500 font-bold"
                >
                    <option value="">-- Pilih Mentor --</option>
                    {mentors.map(mentor => (
                        <option key={mentor.id} value={mentor.id}>
                            {mentor.name} ({mentor.role})
                        </option>
                    ))}
                </select>
                {errors.consultantId && <span className="text-red-500 text-xs mt-1 block">{errors.consultantId.message}</span>}
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
                    <UserCheck className="w-3.5 h-3.5" /> 
                    {isSubmitting ? "Menyimpan..." : "Konfirmasi Penugasan"}
                </button>
            </div>
        </form>
    );
}
