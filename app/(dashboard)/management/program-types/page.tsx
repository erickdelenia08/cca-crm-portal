import { getProgramTypes } from '@/actions/program-type.action';
import { ProgramTypeTable } from '@/components/tables/program-type-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manajemen Program Types | CRM Student Portal',
    description: 'Kelola tipe atau kategori layanan program CCA',
};

export default async function ProgramTypesPage() {
    const programTypes = await getProgramTypes();

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <ProgramTypeTable initialData={programTypes} />
        </div>
    );
}
