import { getEnrollmentDocumentRequirements } from "@/actions/processor-portal.action";
import { AddRequirementForm } from "@/components/forms/add-requirement-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProcessorEnrollmentDocumentsPage({
    params,
}: {
    params: Promise<{ enrollmentId: string }>;
}) {
    const resolvedParams = await params;
    const { success, data: requirements } = await getEnrollmentDocumentRequirements(resolvedParams.enrollmentId);

    if (!success || !requirements) {
        notFound();
    }

    const getStatusInfo = (req: typeof requirements[0]) => {
        if (req.documents.length === 0) {
            return {
                label: "Missing",
                icon: AlertCircle,
                color: "text-red-500",
                badgeClass: "bg-red-50 text-red-700 border-red-200"
            };
        }

        const latestDoc = req.documents[0];
        
        switch (latestDoc.status) {
            case "APPROVED":
                return {
                    label: "Verified",
                    icon: Check,
                    color: "text-emerald-500",
                    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
                };
            case "REJECTED":
            case "REVISION_REQUIRED":
                return {
                    label: "Needs Re-upload",
                    icon: X,
                    color: "text-amber-500",
                    badgeClass: "bg-amber-50 text-amber-700 border-amber-200"
                };
            case "SUBMITTED":
            case "UNDER_REVIEW":
            default:
                return {
                    label: "Pending Review",
                    icon: Clock,
                    color: "text-blue-500",
                    badgeClass: "bg-blue-50 text-blue-700 border-blue-200"
                };
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
                <h2 className="text-lg font-semibold text-slate-800">Document Requirements</h2>
                <AddRequirementForm enrollmentId={resolvedParams.enrollmentId} />
            </div>

            <div className="space-y-3">
                {requirements.map(req => {
                    const statusInfo = getStatusInfo(req);
                    const StatusIcon = statusInfo.icon;
                    const latestDoc = req.documents.length > 0 ? req.documents[0] : null;

                    return (
                        <Card key={req.id} className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 flex-shrink-0 ${statusInfo.color}`}>
                                            <StatusIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">{req.name}</h3>
                                                {!req.requirementId && (
                                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 text-xs">
                                                        Additional
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            {latestDoc ? (
                                                <div className="mt-2 text-sm">
                                                    <Badge variant="outline" className={statusInfo.badgeClass}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                    {latestDoc.revisionNote && (latestDoc.status === "REVISION_REQUIRED" || latestDoc.status === "REJECTED") && (
                                                        <p className="mt-2 text-amber-700 bg-amber-50/50 p-2 rounded border border-amber-100 text-xs">
                                                            <span className="font-semibold block mb-0.5">Reason:</span>
                                                            {latestDoc.revisionNote}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-2">
                                                    <Badge variant="outline" className={statusInfo.badgeClass}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                    {req.description && (
                                                        <p className="mt-1 text-xs text-slate-500">{req.description}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 ml-4 flex gap-2">
                                        {latestDoc ? (
                                            <Link 
                                                href={`/processor/documents/${latestDoc.id}`}
                                                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-blue-600")}
                                            >
                                                Review Document
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        ) : (
                                            <Button variant="outline" size="sm" className="text-slate-500" disabled>
                                                Awaiting Upload
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {requirements.length === 0 && (
                    <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-slate-900">No Requirements Found</h3>
                        <p className="text-sm text-slate-500 mt-1">This enrollment does not have any document requirements.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
