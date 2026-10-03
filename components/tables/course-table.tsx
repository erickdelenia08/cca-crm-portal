"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, CheckCircle2, XCircle, GraduationCap, Building2 } from "lucide-react";
import { CourseCategory, CourseLevel } from "@prisma/client";
import { Prisma } from "@prisma/client";

type CourseWithRelations = Prisma.CourseGetPayload<{
    include: {
        programType: { include: { program: true } };
        _count: { select: { classes: true } };
    };
}>;

interface CourseTableProps {
    courses: CourseWithRelations[];
}

export function CourseTable({ courses }: CourseTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [programFilter, setProgramFilter] = useState<string>("ALL");

    // Extract unique programs for filter
    const uniquePrograms = Array.from(new Set(courses.map(c => c.programType.program.name)));

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.programType.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "ALL" 
            ? true 
            : statusFilter === "ACTIVE" ? course.isActive : !course.isActive;
            
        const matchesProgram = programFilter === "ALL" || course.programType.program.name === programFilter;

        return matchesSearch && matchesStatus && matchesProgram;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari Kursus / Kode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>
                    
                    <select
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                        <option value="ALL">Semua Program</option>
                        {uniquePrograms.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                                <th className="py-3 px-4">Course</th>
                                <th className="py-3 px-4">Program / Type</th>
                                <th className="py-3 px-4">Level</th>
                                <th className="py-3 px-4 text-center">Classes</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <Link href={`/management/courses/${course.id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors block">
                                                        {course.name}
                                                    </Link>
                                                    <div className="text-[10px] font-mono text-slate-400 font-semibold">{course.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                                {course.programType.program.name}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 ml-5">{course.programType.name}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {course.level ? (
                                                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                                                    {course.level}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="font-bold text-slate-700">{course._count.classes}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {course.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-200">
                                                    <XCircle className="w-3 h-3" /> INACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={`/management/courses/${course.id}`}
                                                className="inline-flex text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Kelola →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400">
                                        <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Tidak ada kursus yang ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
