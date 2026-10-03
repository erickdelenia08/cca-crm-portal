import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EnrollmentStepper } from "@/components/forms/enrollment-stepper";
import { getClientsLookup, getConsultantsLookup, getProgramTypesLookup, getProgramsLookup } from "@/actions/enrollment.action";

export default async function CreateEnrollmentPage() {
    const clients = await getClientsLookup();
    const consultants = await getConsultantsLookup();
    const programs = await getProgramsLookup();
    const programTypes = await getProgramTypesLookup();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <Link href="/management/enrollments" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Enrollments
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Create Enrollment</h1>
                    <p className="text-xs text-gray-500">
                        Buat pendaftaran layanan (Service) atau kelas (Course) baru untuk klien.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <EnrollmentStepper 
                        clients={clients} 
                        consultants={consultants} 
                        programs={programs} 
                        programTypes={programTypes} 
                    />
                </div>
            </div>
        </div>
    );
}
