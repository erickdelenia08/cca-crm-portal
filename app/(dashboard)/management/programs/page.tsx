import React from 'react';
import Link from 'next/link';
import { Plus, FileCheck, Globe, UserPlus, Eye } from 'lucide-react';
import { getPrograms } from "@/actions/program.action";

export default async function ProgramsListPage() {
    const programs = await getPrograms();

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Katalog Program Utama</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola daftar program visa dan persiapan study abroad milik agensi.
                        </p>
                    </div>
                    <Link
                        href="/management/programs/create"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Tambah Program Baru
                    </Link>
                </div>

                {/* Grid Master Program */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {programs.length === 0 ? (
                        <div className="md:col-span-2 bg-white p-10 text-center rounded-xl border border-gray-200">
                            <p className="text-gray-500">Belum ada program yang terdaftar.</p>
                        </div>
                    ) : programs.map((program) => (
                        <div
                            key={program.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-md border border-blue-200 flex items-center gap-1.5">
                                        {program.type === 'WHV' ? (
                                            <FileCheck className="w-3.5 h-3.5" />
                                        ) : (
                                            <Globe className="w-3.5 h-3.5" />
                                        )}
                                        {program.type}
                                    </span>
                                    <span className="text-xs font-medium text-gray-500">
                                        Tujuan: <strong className="text-gray-800">{program.countryTarget}</strong>
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900">{program.title}</h2>

                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <div>
                                        <span className="text-xs text-gray-400 block">Biaya Jasa Dasar</span>
                                        <span className="font-bold text-blue-600 text-base">
                                            Rp {program.basePrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Client Aktif</span>
                                        <span className="font-semibold text-gray-700">{program.activeClientsCount} Orang</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                <Link
                                    href={`/management/programs/${program.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <Eye className="w-4 h-4" /> Detail Master
                                </Link>

                                <Link
                                    href={`/management/enrollments/create?programId=${program.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" /> Daftarkan Client
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}