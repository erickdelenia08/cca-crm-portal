"use client";

import { useState } from "react";
import { Plus, Edit2, BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { CourseForm } from "../forms/course-form";
import { CourseInput } from "@/schemas/course.schema";
import { deleteCourse } from "@/actions/course.action";
import { CourseCategory, CourseLevel } from "@prisma/client";

export interface CourseData {
    id: string;
    code: string;
    name: string;
    category: CourseCategory | null;
    level: CourseLevel | null;
    durationHours: number | null;
    basePrice: number | null;
    isActive: boolean;
}

interface CourseTableProps {
    courses: CourseData[];
}

export function CourseTable({ courses }: CourseTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseInput | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleOpenCreateModal = () => {
        setSelectedCourse(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (course: CourseData) => {
        setSelectedCourse({
            id: course.id,
            code: course.code,
            name: course.name,
            category: course.category || "LANGUAGE",
            level: course.level || "BASIC",
            durationHours: course.durationHours || 0,
            basePrice: course.basePrice || 0,
            isActive: course.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kursus ini?")) return;
        setIsDeleting(id);
        try {
            await deleteCourse(id);
        } catch (error) {
            alert("Gagal menghapus kursus");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manajemen Master Kursus</h1>
                    <p className="text-sm text-slate-500">Kelola katalog mata pelajaran & harga dasar kursus</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                >
                    <Plus size={16} /> Tambah Kursus
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="p-4">Kode</th>
                            <th className="p-4">Nama Kursus</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Level</th>
                            <th className="p-4">Durasi</th>
                            <th className="p-4 text-right">Harga Dasar (Base Price)</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-500">
                                    Belum ada data kursus.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono font-bold text-slate-700">{course.code}</td>
                                    <td className="p-4 font-semibold text-slate-900">{course.name}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs font-semibold text-slate-600">{course.level}</td>
                                    <td className="p-4 text-slate-600">{course.durationHours} Jam</td>
                                    <td className="p-4 text-right font-extrabold text-emerald-600">
                                        Rp {(course.basePrice || 0).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link
                                                href={`/management/courses/${course.id}/classes`}
                                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                                                title="Lihat Kelola Kelas"
                                            >
                                                <BookOpen size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleOpenEditModal(course)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                disabled={isDeleting === course.id}
                                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Input/Edit Master Course */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">
                                {selectedCourse ? "Edit Master Kursus" : "Tambah Master Kursus"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <CourseForm
                            initialData={selectedCourse}
                            onSuccess={() => setIsModalOpen(false)}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
