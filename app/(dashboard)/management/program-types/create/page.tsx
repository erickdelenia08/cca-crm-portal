import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProgramTypeForm } from '@/components/forms/program-type-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buat Program Type | CRM Student Portal',
    description: 'Tambahkan kategori atau jenis program baru ke dalam sistem',
};

export default function CreateProgramTypePage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* ==================================================
                    TOP NAVIGATION
                ================================================== */}

                <div>
                    <Link
                        href="/management/program-types"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Batal & Kembali
                    </Link>
                </div>

                <ProgramTypeForm />

            </div>
        </div>
    );
}

