import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Globe,
    FileCheck,
    Users,
    Calendar,
    Edit3,
    CheckCircle,
    FileText
} from 'lucide-react';
import { getProgramById } from '@/actions/program.action';

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
    const program = await getProgramById(params.id);

    if (!program) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/management/programs"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Program
                    </Link>

                    <button className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm px-3.5 py-2 rounded-lg transition-colors shadow-sm">
                        <Edit3 className="w-4 h-4" /> Edit Program
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-md border border-blue-200 flex items-center gap-1.5">
                                {program.type === 'WHV' ? <FileCheck className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                {program.type}
                            </span>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-medium text-xs rounded-md border border-emerald-200">
                                Tujuan: {program.countryTarget}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                            Status: <strong className="text-gray-900">{program.status}</strong>
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{program.description}</p>
                    </div>

                    <div className="pt-2 flex items-center gap-6 text-sm">
                        <div>
                            <span className="text-xs text-gray-500 block">Biaya Dasar Jasa Program</span>
                            <span className="text-lg font-bold text-blue-600">
                                Rp {program.basePrice.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Client Terdaftar</p>
                            <h3 className="text-xl font-bold text-gray-900">{program.stats.totalClients} Client</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Proses Berjalan</p>
                            <h3 className="text-xl font-bold text-gray-900">{program.stats.activeClients} Client</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Selesai / Stamped Visa</p>
                            <h3 className="text-xl font-bold text-gray-900">{program.stats.completedClients} Client</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" /> Persyaratan Dokumen Program
                    </h2>
                    {program.requirements.length === 0 ? (
                        <p className="text-sm text-gray-500 italic pt-1">Belum ada persyaratan dokumen khusus.</p>
                    ) : (
                        <ul className="space-y-2 pt-1">
                            {program.requirements.map((req, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}