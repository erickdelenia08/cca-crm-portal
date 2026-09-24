"use client";

import Link from "next/link";
import { FileText, GraduationCap, CheckCircle2, Edit3, Globe, Plus } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

// Define the type from the included Prisma relation
type ProgramWithTypes = Prisma.ProgramGetPayload<{
    include: {
        programTypes: {
            include: {
                _count: {
                    select: { courses: true; enrollments: true };
                };
            };
        };
    };
}>;

export function ProgramDetailsTable({ program }: { program: ProgramWithTypes }) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{program.name}</h1>
                            {program.isActive ? (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                    Aktif
                                </span>
                            ) : (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                                    Nonaktif
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {program.description || 'Divisi Layanan & Operasional'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => router.push(`/management/programs/${program.id}/products/create`)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Service Baru
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Nama Layanan</th>
                                <th className="p-4">Tipe Servis</th>
                                <th className="p-4">Informasi Tambahan</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {program.programTypes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Belum ada layanan/service. Silahkan tambahkan service baru.
                                    </td>
                                </tr>
                            )}
                            {program.programTypes.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <Link
                                            href={`/management/programs/${program.id}/products/${item.id}`} 
                                            className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors block"
                                        >
                                            {item.name}
                                        </Link>
                                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{item.code}</div>
                                    </td>
                                    <td className="p-4">
                                        {item.deliveryType === 'SERVICE' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] rounded-md font-bold uppercase tracking-wider">
                                                <FileText className="w-3 h-3 text-slate-500" /> Non-Kelas
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] rounded-md font-bold uppercase tracking-wider">
                                                <GraduationCap className="w-3 h-3 text-purple-600" /> Berkelas
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">
                                        {item.deliveryType === 'COURSE' ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-purple-700">{item._count.courses} Master Courses</span>
                                                <span className="text-[10px] text-slate-500">Manage courses here</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500">{item._count.enrollments} Active Enrollments</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {item.isActive ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3" /> AKTIF
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-extrabold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/management/programs/${program.id}/products/${item.id}`} 
                                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Edit & Kelola
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
