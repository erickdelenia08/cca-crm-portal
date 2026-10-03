import { getProcessorEnrollment } from "@/actions/processor-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function ProcessorEnrollmentOverviewPage({
    params,
}: {
    params: Promise<{ enrollmentId: string }>;
}) {
    const resolvedParams = await params;
    const { success, data: enrollment } = await getProcessorEnrollment(resolvedParams.enrollmentId);

    if (!success || !enrollment) {
        notFound();
    }

    const totalDocs = enrollment.documentRequirements.length;
    const verifiedDocs = enrollment.documentRequirements.filter(req => 
        req.documents.length > 0 && req.documents[0].status === "APPROVED"
    ).length;
    const pendingDocs = enrollment.documentRequirements.filter(req => 
        req.documents.length > 0 && (req.documents[0].status === "SUBMITTED" || req.documents[0].status === "UNDER_REVIEW")
    ).length;
    const needsReupload = enrollment.documentRequirements.filter(req => 
        req.documents.length > 0 && (req.documents[0].status === "REJECTED" || req.documents[0].status === "REVISION_REQUIRED")
    ).length;
    const missingDocs = enrollment.documentRequirements.filter(req => 
        req.documents.length === 0
    ).length;

    const progressPercentage = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Enrollment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Status</p>
                                <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                    {enrollment.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Enrolled Date</p>
                                <p className="font-medium text-slate-900">
                                    {format(new Date(enrollment.enrolledAt), "MMM d, yyyy")}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Consultant</p>
                                <p className="font-medium text-slate-900">
                                    {enrollment.consultant?.consultantProfile?.fullName || enrollment.consultant?.name || "Unassigned"}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Client Email</p>
                                <p className="font-medium text-slate-900">
                                    {enrollment.client.clientProfile?.email || enrollment.client.email || "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Document Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-900">{verifiedDocs} / {totalDocs} Verified</span>
                                <span className="text-slate-500">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-3 mt-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Verified
                                </span>
                                <span className="font-medium text-slate-900">{verifiedDocs}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Pending Review
                                </span>
                                <span className="font-medium text-slate-900">{pendingDocs}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    Needs Re-upload
                                </span>
                                <span className="font-medium text-slate-900">{needsReupload}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Missing
                                </span>
                                <span className="font-medium text-slate-900">{missingDocs}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
