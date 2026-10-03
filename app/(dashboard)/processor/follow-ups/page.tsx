import { getProcessingFollowUps } from "@/actions/processor-portal.action";
import { FollowUpAction } from "@/components/forms/follow-up-action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, History, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default async function ProcessorFollowUpsPage() {
    const { success, data: followUps, error } = await getProcessingFollowUps();

    if (!success || !followUps) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Follow Ups</h3>
                <p>{error || "Unknown error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Follow Ups</h1>
                <p className="text-slate-500 mt-1">Manage documents that require client action.</p>
            </div>

            {followUps.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">No Pending Follow Ups</h3>
                    <p className="text-sm text-slate-500 mt-1">All required documents have been submitted and reviewed.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {followUps.map(item => (
                        <Card key={item.id} className="overflow-hidden border-slate-200">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row justify-between p-4 gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 flex-shrink-0 ${item.type === 'MISSING' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {item.type === 'MISSING' ? <AlertCircle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900">{item.clientName}</h3>
                                                <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs font-normal">
                                                    {item.programName}
                                                </Badge>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-slate-700">{item.requirementName}</span>
                                                <span className="text-slate-400 mx-2">•</span>
                                                <Badge variant="outline" className={
                                                    item.type === 'MISSING' 
                                                    ? "bg-red-50 text-red-700 border-red-200" 
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                                }>
                                                    {item.type === 'MISSING' ? 'Missing' : 'Needs Re-upload'}
                                                </Badge>
                                            </div>
                                            
                                            {item.reason && (
                                                <p className="mt-2 text-amber-800 bg-amber-50 p-2 rounded border border-amber-100 text-xs">
                                                    <span className="font-semibold block mb-0.5">Rejection Reason:</span>
                                                    {item.reason}
                                                </p>
                                            )}

                                            <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                                                <span>Added: {format(new Date(item.date), "MMM d, yyyy")}</span>
                                                {item.consultantName && <span>Consultant: {item.consultantName}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center md:self-center shrink-0">
                                        <FollowUpAction 
                                            requirementId={item.requirementId} 
                                            requirementName={item.requirementName} 
                                            clientName={item.clientName} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
