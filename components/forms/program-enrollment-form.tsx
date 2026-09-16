"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Banknote,
    BriefcaseBusiness,
    ChevronDown,
    UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programEnrollmentSchema, ProgramEnrollmentInput } from "@/schemas/enrollment.schema";
import { createProgramEnrollment } from "@/actions/enrollment.action";
import { EnrollmentStatus } from "@prisma/client";


import {
    StudentOption,
    ConsultantOption,
    ProgramOption,
    ProgramTypeOption
} from "@/types/enrollment"; // Sesuaikan path file kamu

interface ProgramEnrollmentFormProps {
    students: StudentOption[];
    programs: ProgramOption[];
    programTypes: ProgramTypeOption[];
    consultants: ConsultantOption[];
}
export function ProgramEnrollmentForm({
    students,
    programs,
    programTypes,
    consultants,
}: ProgramEnrollmentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProgramEnrollmentInput>({
        resolver: zodResolver(programEnrollmentSchema),
        defaultValues: {
            status: EnrollmentStatus.ONBOARDING,
            notes: "",
        },
    });

    const studentId = watch("studentId");
    const programId = watch("programId");
    const [programTypeId, setProgramTypeId] = useState("");

    const selectedStudent = useMemo(() => students.find((s) => s.id === studentId), [students, studentId]);

    const availablePrograms = useMemo(
        () => programs.filter((p) => p.typeId === programTypeId),
        [programs, programTypeId]
    );

    const selectedProgram = useMemo(() => programs.find((p) => p.id === programId), [programs, programId]);

    const handleProgramTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProgramTypeId(e.target.value);
        setValue("programId", "", { shouldValidate: true });
    };

    const onSubmit = async (data: ProgramEnrollmentInput) => {
        try {
            setIsSubmitting(true);
            await createProgramEnrollment(data);
            router.push("/management/enrollments");
            router.refresh();
        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : String(error);
            alert("Gagal membuat enrollment: " + err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ==================================================
                CLIENT
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <UserRound className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Client</h2>
                        <p className="text-xs text-gray-400">Pilih client yang akan mengikuti program.</p>
                    </div>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <select
                            {...register("studentId")}
                            className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.studentId ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Pilih client...</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name} — {student.email}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.studentId && (
                        <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
                    )}

                    {selectedStudent && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <UserRound className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                                    <p className="text-xs text-gray-500">{selectedStudent.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================================
                PROGRAM
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BriefcaseBusiness className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Program</h2>
                        <p className="text-xs text-gray-400">Pilih jenis program dan program tujuan.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jenis Program <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={programTypeId}
                                onChange={handleProgramTypeChange}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih jenis program...</option>
                                {programTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Program <span className="text-red-500 ml-1">*</span>
                        </label>
                        {!programTypeId ? (
                            <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                                Pilih jenis program terlebih dahulu.
                            </div>
                        ) : availablePrograms.length === 0 ? (
                            <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                                Belum ada program untuk jenis ini.
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    {...register("programId")}
                                    className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.programId ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Pilih program...</option>
                                    {availablePrograms.map((program) => (
                                        <option key={program.id} value={program.id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        )}
                        {errors.programId && (
                            <p className="text-red-500 text-xs mt-1">{errors.programId.message}</p>
                        )}
                    </div>

                    {selectedProgram && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Tujuan</p>
                                <p className="font-semibold text-gray-900 mt-1">{selectedProgram.destination}</p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Deskripsi Singkat</p>
                                <p className="font-semibold text-gray-900 mt-1 line-clamp-1">{selectedProgram.description || "-"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================================
                PIC & STATUS
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <UserRound className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">PIC & Status</h2>
                        <p className="text-xs text-gray-400">Pilih consultant yang menangani dan status pendaftaran.</p>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Consultant / PIC
                        </label>
                        <div className="relative">
                            <select
                                {...register("consultantId")}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tanpa Consultant (Assign Nanti)</option>
                                {consultants.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status Enrollment <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...register("status")}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.values(EnrollmentStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                NOTES
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Catatan Internal (Opsional)
                    </label>
                    <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Tambahkan catatan khusus terkait pendaftaran ini..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </section>

            {/* ==================================================
                SUBMIT
            ================================================== */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {isSubmitting ? (
                        <>Loading...</>
                    ) : (
                        <>
                            <BriefcaseBusiness className="w-4 h-4" />
                            Buat Enrollment
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
