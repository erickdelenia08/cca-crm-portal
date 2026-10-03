import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/components/forms/program-form";
import { getProgramById } from "@/actions/program.action";

export default async function EditProgramPage({
    params,
}: {
    params: Promise<{ programId: string }>;
}) {
    const { programId } = await params;
    const program = await getProgramById(programId);

    if (!program) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-xl mx-auto">
                <div className="mb-4">
                    <Link href={`/management/programs/${programId}`} className="text-xs text-blue-600 hover:underline">
                        ← Back to Program
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Edit Program</h1>
                    <p className="text-xs text-gray-500 mb-6">Ubah data unit/kelompok bisnis (Business Line).</p>

                    <ProgramForm initialData={{
                        id: program.id,
                        name: program.name,
                        code: program.code,
                        description: program.description || "",
                        isActive: program.isActive,
                    }} />
                </div>
            </div>
        </div>
    );
}
