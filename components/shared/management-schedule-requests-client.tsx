"use client";

import { useState } from "react";
import { ManagementScheduleChangeRequest } from "@/actions/teacher-portal.action";
import { approveScheduleChangeRequest, rejectScheduleChangeRequest } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Calendar, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    initialRequests: ManagementScheduleChangeRequest[];
}

export function ManagementScheduleRequestsClient({ initialRequests }: Props) {
    const router = useRouter();
    const [requests, setRequests] = useState(initialRequests);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectionNote, setRejectionNote] = useState<Record<string, string>>({});
    const [showRejectForm, setShowRejectForm] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        if (!confirm("Are you sure you want to approve this request? The session schedule will be automatically updated.")) return;
        
        setProcessingId(id);
        try {
            const res = await approveScheduleChangeRequest(id);
            if (res.success) {
                setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "APPROVED" } : req));
                router.refresh();
            } else {
                alert(res.error);
            }
        } catch (e) {
            alert("Failed to approve request");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const reason = rejectionNote[id] || "";
        if (!reason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }

        setProcessingId(id);
        try {
            const res = await rejectScheduleChangeRequest(id, reason);
            if (res.success) {
                setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "REJECTED", reviewNote: reason } : req));
                setShowRejectForm(null);
                router.refresh();
            } else {
                alert(res.error);
            }
        } catch (e) {
            alert("Failed to reject request");
        } finally {
            setProcessingId(null);
        }
    };

    const pendingRequests = requests.filter(r => r.status === "PENDING");
    const pastRequests = requests.filter(r => r.status !== "PENDING");

    const renderRequestCard = (request: ManagementScheduleChangeRequest) => {
        const isPending = request.status === "PENDING";
        const isApproved = request.status === "APPROVED";
        
        return (
            <Card key={request.id} className={`overflow-hidden ${isPending ? 'border-indigo-200 shadow-sm' : 'opacity-70'}`}>
                <div className={`h-1.5 w-full ${isPending ? 'bg-amber-400' : isApproved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant={isPending ? "outline" : isApproved ? "default" : "destructive"} 
                                    className={isPending ? "text-amber-700 border-amber-300 bg-amber-50" : isApproved ? "bg-emerald-500" : ""}>
                                    {request.status}
                                </Badge>
                                <span className="text-xs text-slate-500">Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{request.session.title}</h3>
                            <p className="text-sm text-slate-600 font-medium">
                                {request.session.courseClass.name} ({request.session.courseClass.code})
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{request.session.courseClass.teacher?.user.name || "Unknown Teacher"}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border mb-4">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Schedule</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="line-through text-slate-500">{new Date(request.session.startTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="line-through text-slate-500">
                                        {new Date(request.session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(request.session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 hidden md:block text-slate-300">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                            <h4 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Requested Change</h4>
                            <div className="space-y-1 text-sm font-medium text-indigo-900">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                    <span>{new Date(request.requestedStartTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-400" />
                                    <span>
                                        {new Date(request.requestedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(request.requestedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-indigo-100 text-xs text-indigo-700">
                                Mode: <strong>{request.requestedMode}</strong> 
                                {request.requestedMode === "ONLINE" ? ` via ${request.requestedMeetingProvider}` : ` at ${request.requestedLocation}`}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Teacher&apos;s Reason</h4>
                        <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3 py-1">&quot;{request.reason}&quot;</p>
                    </div>

                    {!isPending && request.reviewNote && (
                        <div className={`mb-4 p-3 rounded-md text-sm ${isApproved ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                            <strong>Review Note:</strong> {request.reviewNote}
                        </div>
                    )}

                    {isPending && (
                        <div className="flex flex-col gap-3 pt-4 border-t">
                            {showRejectForm === request.id ? (
                                <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-100">
                                    <label className="text-sm font-medium text-red-900">Reason for Rejection</label>
                                    <Textarea 
                                        placeholder="Explain why this request is rejected..."
                                        value={rejectionNote[request.id] || ""}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionNote({...rejectionNote, [request.id]: e.target.value})}
                                        className="border-red-200 bg-white"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => setShowRejectForm(null)} disabled={processingId === request.id}>Cancel</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)} disabled={processingId === request.id}>
                                            Confirm Reject
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-end gap-3">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => setShowRejectForm(request.id)}
                                        disabled={processingId !== null}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => handleApprove(request.id)}
                                        disabled={processingId !== null}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve Change
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    Pending Action <span className="bg-amber-100 text-amber-800 py-0.5 px-2.5 rounded-full text-sm">{pendingRequests.length}</span>
                </h3>
                {pendingRequests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 border rounded-lg bg-slate-50 border-dashed">
                        <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400 opacity-50" />
                        <p>All caught up! No pending schedule change requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map(renderRequestCard)}
                    </div>
                )}
            </section>

            {pastRequests.length > 0 && (
                <section>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 border-t pt-8">Request History</h3>
                    <div className="space-y-4">
                        {pastRequests.map(renderRequestCard)}
                    </div>
                </section>
            )}
        </div>
    );
}
