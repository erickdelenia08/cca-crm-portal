import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramById } from "@/actions/program.action";
import { ProgramDetailsTable } from "@/components/tables/program-details-table";

export default async function ProgramDetailPage({
    params,
}: {
    params: Promise<{ programId: string }>;
}) {
    const { programId } = await params;
    
    // Fetch data using Server Action
    const program = await getProgramById(programId);

    if (!program) {
        return notFound();
    }

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="space-y-3">
                <Link
                    href="/management/programs"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Brand
                </Link>
            </div>

            {/* Table and Header */}
            <ProgramDetailsTable program={program} />
        </div>
    );
}