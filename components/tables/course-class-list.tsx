"use client";

import { useState } from "react";
import { Plus, Calendar, Users, User, Edit2, Trash2 } from "lucide-react";
import { CourseClassForm } from "../forms/course-class-form";
import { deleteCourseClass } from "@/actions/course-class.action";
import { CourseClassInput } from "@/schemas/course-class.schema";

export interface ClassSectionData {
    id: string;
    code: string;
    courseId: string;
    teacherId: string;
    teacherName: string;
    schedule: string;
    maxCapacity: number;
    currentEnrolled: number;
    startDate: string;
    endDate: string;
}

interface CourseClassListProps {
    courseId: string;
    classes: ClassSectionData[];
    teachers: { id: string; name: string }[];
}

export function CourseClassList({ courseId, classes, teachers }: CourseClassListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Partial<CourseClassInput> | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleOpenCreateModal = () => {
        setSelectedClass(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: ClassSectionData) => {
        setSelectedClass({
            id: item.id,
            courseId: item.courseId,
            code: item.code,
            teacherId: item.teacherId,
            schedule: item.schedule,
            maxCapacity: item.maxCapacity,
            startDate: item.startDate,
            endDate: item.endDate,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;
        setIsDeleting(id);
        try {
            await deleteCourseClass(id, courseId);
        } catch (error) {
            alert("Gagal menghapus kelas");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm">Daftar Kelas Aktif</h3>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs transition"
                >
                    <Plus size={16} /> Buka Kelas Baru
                </button>
            </div>

            {/* Grid Card Daftar Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.length === 0 ? (
                    <div className="col-span-full p-6 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm">
                        Belum ada kelas yang dibuka untuk kursus ini.
                    </div>
                ) : (
                    classes.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="font-mono font-bold text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                        {item.code}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={isDeleting === item.id}
                                            className="p-1 text-slate-400 hover:text-red-600 transition disabled:opacity-50"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-800">{item.teacherName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>{item.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-slate-400" />
                                        <span>
                                            Kapasitas: <strong>{item.currentEnrolled}</strong> / {item.maxCapacity} Peserta
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[11px] text-slate-500">
                                <span>Periode:</span>
                                <span className="font-semibold text-slate-700">
                                    {item.startDate} s/d {item.endDate}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form Tambah/Edit Class Section */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-sm">
                                {selectedClass ? "Edit Kelas" : "Buka Kelas Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                            >
                                ✕
                            </button>
                        </div>
                        <CourseClassForm
                            courseId={courseId}
                            teachers={teachers}
                            initialData={selectedClass}
                            onSuccess={() => setIsModalOpen(false)}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
