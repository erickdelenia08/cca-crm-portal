import { getProcessorEnrollments } from "@/actions/processor-portal.action";
import { ProcessorEnrollmentsTable } from "@/components/tables/processor-enrollments-table";

export default async function ProcessorEnrollmentsPage() {
    const { success, data: enrollments, error } = await getProcessorEnrollments();

    if (!success || !enrollments) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Enrollments</h3>
                <p>{error || "Unknown error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Enrollments</h1>
                <p className="text-slate-500 mt-1">Manage processing for all active service enrollments.</p>
            </div>

            <ProcessorEnrollmentsTable enrollments={enrollments} />
        </div>
    );
}
