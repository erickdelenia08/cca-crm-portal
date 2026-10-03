import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnrollmentById } from "@/actions/enrollment.action";
import { EnrollmentEditForm } from "@/components/forms/enrollment-edit-form";
import { ArrowLeft } from "lucide-react";

export default async function EditEnrollmentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const enrollment = await getEnrollmentById(id);
    if (!enrollment) return notFound();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <Link href={`/management/enrollments/${id}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Enrollment Detail
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Enrollment</h1>
                    <p className="text-xs text-gray-500">
                        Perbarui status dan catatan pendaftaran.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <EnrollmentEditForm enrollment={enrollment as any} />
                </div>
            </div>
        </div>
    );
}
