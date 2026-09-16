import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgramForm } from "@/components/forms/program-form";
import { getProgramTypes } from "@/actions/program-type.action";

export default async function CreateProgramPage() {
    const programTypes = await getProgramTypes();

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/management/programs"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Batal & Kembali
                    </Link>
                </div>

                <ProgramForm programTypes={programTypes} />
            </div>
        </div>
    );
}