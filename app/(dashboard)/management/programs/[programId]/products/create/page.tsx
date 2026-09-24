import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramById } from "@/actions/program.action";
import { ProgramServiceForm } from "@/components/forms/program-service-form";

export default async function CreateProductUnderProgramPage({
    params,
}: {
    params: Promise<{ programId: string }>;
}) {
    const { programId } = await params;
    
    // Fetch the parent program to ensure it exists and get its name
    const program = await getProgramById(programId);
    
    if (!program) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Link href={`/management/programs/${programId}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to {program.name}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Create Product / Service</h1>
                    <p className="text-xs text-gray-500">
                        Menambahkan produk baru khusus untuk Business Line: <strong className="uppercase text-gray-800">{program.name}</strong>
                    </p>
                </div>

                <ProgramServiceForm programId={program.id} programName={program.name} />
            </div>
        </div>
    );
}