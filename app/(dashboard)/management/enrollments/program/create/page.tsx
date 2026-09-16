import React from "react";
import { ProgramEnrollmentForm } from "@/components/forms/program-enrollment-form";
import {
    getStudentsLookup,
    getConsultantsLookup,
    getProgramsLookup,
    getProgramTypesLookup,
} from "@/actions/enrollment.action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CreateProgramEnrollmentPage() {
    const [students, programs, programTypes, consultants] = await Promise.all([
        getStudentsLookup(),
        getProgramsLookup(),
        getProgramTypesLookup(),
        getConsultantsLookup(),
    ]);

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/management/enrollments"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Enrollment
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Program Enrollment</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Daftarkan client ke program dan tentukan consultant yang menangani.
                        </p>
                    </div>
                </div>

                <ProgramEnrollmentForm
                    students={students}
                    programs={programs}
                    programTypes={programTypes}
                    consultants={consultants}
                />
            </div>
        </div>
    );
}
