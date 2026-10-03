import { getDocumentForProcessing } from "@/actions/processor-portal.action";
import { DocumentReviewForm } from "@/components/forms/document-review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileIcon, Download, History } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProcessorDocumentReviewPage({
    params,
}: {
    params: Promise<{ documentId: string }>;
}) {
    const resolvedParams = await params;
    const { success, data: document } = await getDocumentForProcessing(resolvedParams.documentId);

    if (!success || !document) {
        notFound();
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SUBMITTED":
            case "UNDER_REVIEW":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Review</Badge>;
            case "REVISION_REQUIRED":
            case "REJECTED":
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Needs Re-upload</Badge>;
            case "APPROVED":
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link 
                href="/processor/documents" 
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-4 text-slate-500 hover:text-slate-900")}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                        {document.client.clientProfile?.fullName || document.client.name || 'Unknown Client'}
                    </h1>
                    <div className="text-slate-600 space-y-1 mb-4">
                        <p className="font-medium">{document.enrollment.programType.program.name}</p>
                        <p>{document.enrollment.programType.name}</p>
                        <p className="text-sm">Enrollment #ENR-{document.enrollmentId.substring(0, 8).toUpperCase()}</p>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-slate-900 mt-4 flex items-center gap-2">
                        {document.requirement.name}
                    </h2>
                </div>
                <div className="self-start md:self-auto">
                    {getStatusBadge(document.status)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>File Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="p-3 bg-white rounded-md shadow-sm">
                                    <FileIcon className="w-8 h-8 text-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {document.clientDocument?.fileName || "Unknown File"}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                        <span>Uploaded: {format(new Date(document.createdAt), "MMM d, yyyy HH:mm")}</span>
                                        {document.clientDocument?.fileSize && (
                                            <span>• {(document.clientDocument.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                        )}
                                    </div>
                                </div>
                                <a 
                                    href={`/api/documents/${document.id}/download`} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 bg-white")}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </a>
                            </div>

                            {document.requirement.description && (
                                <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                                    <span className="font-semibold block mb-1">Requirement Instructions:</span>
                                    {document.requirement.description}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-500" />
                                Processing History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {document.history.length > 0 ? (
                                <div className="space-y-4">
                                    {document.history.map((record) => (
                                        <div key={record.id} className="flex gap-4">
                                            <div className="w-24 shrink-0 text-xs text-slate-500 pt-1">
                                                {format(new Date(record.createdAt), "MMM d, HH:mm")}
                                            </div>
                                            <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getStatusBadge(record.status)}
                                                    <span className="text-xs text-slate-500">
                                                        by {record.updatedBy.staffProfile?.fullName || record.updatedBy.consultantProfile?.fullName || record.updatedBy.name || "System"}
                                                    </span>
                                                </div>
                                                {record.note && (
                                                    <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border mt-2">
                                                        {record.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">No processing history recorded.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <DocumentReviewForm 
                        documentId={document.id} 
                        currentStatus={document.status} 
                    />
                </div>
            </div>
        </div>
    );
}
