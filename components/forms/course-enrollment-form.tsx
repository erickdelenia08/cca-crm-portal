"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseEnrollmentSchema, CourseEnrollmentInput } from "@/schemas/enrollment.schema";
import { createCourseEnrollment } from "@/actions/enrollment.action";
import { CourseEnrollmentStatus } from "@prisma/client";

interface CourseEnrollmentFormProps {
    students: { id: string; name: string | null; email: string }[];
    courses: {
        id: string;
        code: string;
        title: string;
        category: string;
        level: string;
        price: number;
    }[];
    classes: {
        id: string;
        courseId: string;
        code: string;
        teacherName: string | null;
        schedule: string;
        maxCapacity: number;
        currentEnrolled: number;
        startDate: string;
        endDate: string;
    }[];
}

export function CourseEnrollmentForm({
    students,
    courses,
    classes,
}: CourseEnrollmentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CourseEnrollmentInput>({
        resolver: zodResolver(courseEnrollmentSchema),
        defaultValues: {
            status: CourseEnrollmentStatus.ACTIVE,
            notes: "",
        },
    });

    const studentId = watch("studentId");
    const [courseId, setCourseId] = useState("");
    const classId = watch("courseClassId");

    const selectedStudent = useMemo(() => students.find((s) => s.id === studentId), [students, studentId]);

    const availableClasses = useMemo(
        () => classes.filter((c) => c.courseId === courseId),
        [classes, courseId]
    );

    const selectedCourse = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);
    const selectedClass = useMemo(() => classes.find((c) => c.id === classId), [classes, classId]);

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCourseId(e.target.value);
        setValue("courseClassId", "", { shouldValidate: true });
    };

    const remainingSeats = selectedClass ? selectedClass.maxCapacity - selectedClass.currentEnrolled : 0;
    const isFull = selectedClass !== undefined && remainingSeats <= 0;

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    };

    const onSubmit = async (data: CourseEnrollmentInput) => {
        if (isFull) {
            alert("Kelas / batch yang dipilih sudah penuh.");
            return;
        }

        try {
            setIsSubmitting(true);
            await createCourseEnrollment(data);
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
                        <p className="text-xs text-gray-400">Pilih client yang akan mengikuti course.</p>
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
                COURSE & CLASS
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Course & Kelas</h2>
                        <p className="text-xs text-gray-400">Pilih course kemudian tentukan kelas / batch.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={courseId}
                                onChange={handleCourseChange}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih course...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} — {course.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {selectedCourse && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Code</p>
                                <p className="font-semibold text-gray-900 mt-1">{selectedCourse.code}</p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Category</p>
                                <p className="font-semibold text-gray-900 mt-1">{selectedCourse.category}</p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Level</p>
                                <p className="font-semibold text-gray-900 mt-1">{selectedCourse.level}</p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-400">Harga Base</p>
                                <p className="font-semibold text-gray-900 mt-1">{formatRupiah(selectedCourse.price)}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kelas / Batch <span className="text-red-500 ml-1">*</span>
                        </label>
                        {!courseId ? (
                            <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                                Pilih course terlebih dahulu untuk melihat kelas yang tersedia.
                            </div>
                        ) : availableClasses.length === 0 ? (
                            <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                                Belum ada kelas / batch tersedia untuk course ini.
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    {...register("courseClassId")}
                                    className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.courseClassId ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Pilih kelas / batch...</option>
                                    {availableClasses.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.code} (Sisa: {cls.maxCapacity - cls.currentEnrolled} kursi)
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        )}
                        {errors.courseClassId && (
                            <p className="text-red-500 text-xs mt-1">{errors.courseClassId.message}</p>
                        )}
                    </div>

                    {selectedClass && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Teacher</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedClass.teacherName || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Jadwal</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedClass.schedule}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Kapasitas</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        <span className={isFull ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                            {remainingSeats}
                                        </span>{" "}
                                        / {selectedClass.maxCapacity} Kursi
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {isFull ? (
                                            <span className="text-red-600 font-bold">Penuh</span>
                                        ) : (
                                            <span className="text-green-600 font-bold">Tersedia</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================================
                STATUS
            ================================================== */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status Enrollment <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <select
                            {...register("status")}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(CourseEnrollmentStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
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
                    disabled={isSubmitting || isFull}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {isSubmitting ? (
                        <>Loading...</>
                    ) : (
                        <>
                            <BookOpen className="w-4 h-4" />
                            Buat Course Enrollment
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
