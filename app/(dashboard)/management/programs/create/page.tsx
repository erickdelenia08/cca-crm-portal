import React from "react";
import Link from "next/link";
import { ProgramForm } from "@/components/forms/program-form";

export default function CreateProgramPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-xl mx-auto">
                <div className="mb-4">
                    <Link href="/management/programs" className="text-xs text-blue-600 hover:underline">
                        ← Back to Business Lines
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Create Program</h1>
                    <p className="text-xs text-gray-500 mb-6">Tambah unit/kelompok bisnis baru (Business Line).</p>

                    <ProgramForm />
                </div>
            </div>
        </div>
    );
}
