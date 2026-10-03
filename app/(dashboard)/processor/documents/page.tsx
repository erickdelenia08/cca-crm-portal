import { getDocumentQueue } from "@/actions/processor-portal.action";
import { DocumentQueueTable } from "@/components/tables/document-queue-table";

export default async function ProcessorDocumentQueuePage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
    const status = typeof searchParams?.status === 'string' ? searchParams.status : undefined;

    const { success, data: queue, error } = await getDocumentQueue({ search, status });

    if (!success || !queue) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Queue</h3>
                <p>{error || "Unknown error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Queue</h1>
                <p className="text-slate-500 mt-1">Review and process submitted documents, and track missing requirements.</p>
            </div>

            <DocumentQueueTable queue={queue} search={search} status={status} />
        </div>
    );
}