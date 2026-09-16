"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Power,
    Tag,
    MoreHorizontal,
    Filter,
    X,
} from 'lucide-react';
import { deleteProgramType, upsertProgramType } from '@/actions/program-type.action';

export interface ProgramTypeData {
    id: string;
    name: string;
    code: string;
    description: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    programCount: number;
    createdAt: string;
}

export function ProgramTypeTable({ initialData }: { initialData: ProgramTypeData[] }) {
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const filteredProgramTypes = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return initialData.filter((item) => {
            const matchesSearch =
                !keyword ||
                item.name.toLowerCase().includes(keyword) ||
                item.code.toLowerCase().includes(keyword) ||
                item.description?.toLowerCase().includes(keyword);

            const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [initialData, search, statusFilter]);

    const totalCount = initialData.length;
    const activeCount = initialData.filter((item) => item.status === 'ACTIVE').length;
    const inactiveCount = initialData.filter((item) => item.status === 'INACTIVE').length;

    const handleDelete = async (programType: ProgramTypeData) => {
        if (programType.programCount > 0) {
            alert(`Program Type "${programType.name}" tidak dapat dihapus karena masih digunakan oleh ${programType.programCount} program.`);
            return;
        }

        const confirmed = window.confirm(`Apakah kamu yakin ingin menghapus "${programType.name}"?`);
        if (!confirmed) return;

        setIsProcessing(programType.id);
        try {
            await deleteProgramType(programType.id);
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Gagal menghapus program type");
        } finally {
            setIsProcessing(null);
        }
    };

    const handleToggleStatus = async (programType: ProgramTypeData) => {
        const nextStatus = programType.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const confirmed = window.confirm(`${nextStatus === 'ACTIVE' ? 'Aktifkan' : 'Nonaktifkan'} "${programType.name}"?`);

        if (!confirmed) return;

        setIsProcessing(programType.id);
        try {
            await upsertProgramType({
                id: programType.id,
                name: programType.name,
                code: programType.code,
                description: programType.description || undefined,
                isActive: nextStatus === 'ACTIVE',
            });
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Gagal mengubah status program type");
        } finally {
            setIsProcessing(null);
        }
    };

    const clearFilter = () => {
        setSearch('');
        setStatusFilter('ALL');
    };

    const hasFilter = search.trim() !== '' || statusFilter !== 'ALL';

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50">
                            <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Program Types
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        Kelola tipe atau kategori layanan program CCA.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => router.push('/management/program-types/create')}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Program Type
                </button>
            </div>

            {/* ==================================================
                STAT CARDS
            ================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Total Program Type</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-gray-500 mt-1">{inactiveCount}</p>
                </div>
            </div>

            {/* ==================================================
                TABLE CARD
            ================================================== */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* TOOLBAR */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau code..."
                                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="relative md:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                                className="w-full appearance-none pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                        {hasFilter && (
                            <button
                                type="button"
                                onClick={clearFilter}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-4 h-4" /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                {filteredProgramTypes.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                            <Tag className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mt-4">Program Type tidak ditemukan</h3>
                        <p className="text-xs text-gray-500 mt-1">Tidak ada data yang sesuai dengan pencarian atau filter.</p>
                        {hasFilter && (
                            <button type="button" onClick={clearFilter} className="text-xs font-semibold text-blue-600 hover:underline mt-3">
                                Reset filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Program Type</th>
                                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                    <th className="text-center px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Programs</th>
                                    <th className="text-center px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProgramTypes.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">ID: {item.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-mono font-medium text-gray-700">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 max-w-sm">
                                            <p className="text-xs text-gray-600 line-clamp-2">{item.description || '-'}</p>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700">
                                                {item.programCount}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {item.status === 'ACTIVE' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-[11px] font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[11px] font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    disabled={isProcessing === item.id}
                                                    onClick={() => handleToggleStatus(item)}
                                                    className={`p-2 rounded-lg transition-colors ${item.status === 'ACTIVE'
                                                        ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                                                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    } disabled:opacity-50`}
                                                    title={item.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isProcessing === item.id}
                                                    onClick={() => handleDelete(item)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button type="button" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="More">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {filteredProgramTypes.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-700">{filteredProgramTypes.length}</span> dari <span className="font-semibold text-gray-700">{initialData.length}</span> Program Type
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
