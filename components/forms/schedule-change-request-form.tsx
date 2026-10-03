"use client";

import { useState } from "react";
import { createScheduleChangeRequest, TeacherSessionDetail } from "@/actions/teacher-portal.action";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ScheduleChangeRequestFormProps {
    session: TeacherSessionDetail;
}

export function ScheduleChangeRequestForm({ session }: ScheduleChangeRequestFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    // Default values based on current session
    const curDate = new Date(session.startTime).toISOString().split('T')[0];
    const curStart = new Date(session.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const curEnd = new Date(session.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const [requestedDate, setRequestedDate] = useState(curDate);
    const [requestedStartTime, setRequestedStartTime] = useState(curStart);
    const [requestedEndTime, setRequestedEndTime] = useState(curEnd);
    const [requestedMode, setRequestedMode] = useState<"ONLINE" | "OFFLINE" | "HYBRID">(session.mode);
    const [requestedLocation, setRequestedLocation] = useState(session.location || "");
    const [requestedMeetingProvider, setRequestedMeetingProvider] = useState<"ZOOM" | "GOOGLE_MEET" | "OTHER">(session.meetingProvider || "GOOGLE_MEET");
    const [requestedMeetingUrl, setRequestedMeetingUrl] = useState(session.meetingUrl || "");
    const [reason, setReason] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!reason.trim()) {
            alert("Please provide a reason for the schedule change request.");
            return;
        }

        if (requestedMode === "ONLINE" && requestedMeetingProvider === "GOOGLE_MEET") {
            if (!requestedMeetingUrl || !requestedMeetingUrl.includes("meet.google.com")) {
                alert("Please provide a valid Google Meet URL.");
                return;
            }
        }

        setIsLoading(true);
        try {
            const result = await createScheduleChangeRequest({
                sessionId: session.id,
                requestedDate,
                requestedStartTime,
                requestedEndTime,
                requestedMode,
                requestedLocation: requestedMode === "OFFLINE" ? requestedLocation : undefined,
                requestedMeetingProvider: requestedMode === "ONLINE" ? requestedMeetingProvider : undefined,
                requestedMeetingUrl: requestedMode === "ONLINE" ? requestedMeetingUrl : undefined,
                reason
            });

            if (result.success) {
                router.push(`/teacher/classes/${session.courseClassId}/sessions/${session.id}`);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to submit request.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold text-slate-700 border-b pb-2">Current Schedule</h4>
                    
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Date</p>
                        <p className="font-medium">{new Date(session.startTime).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Start Time</p>
                            <p className="font-medium">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">End Time</p>
                            <p className="font-medium">{new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Mode & Location</p>
                        <p className="font-medium">{session.mode} - {session.mode === "ONLINE" ? "Google Meet" : session.location || "N/A"}</p>
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg border-indigo-100 bg-white">
                    <h4 className="font-semibold text-indigo-700 border-b border-indigo-50 pb-2">Requested Changes</h4>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">New Date</label>
                        <Input 
                            type="date" 
                            required 
                            value={requestedDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium text-slate-700">New Start Time</label>
                            <Input 
                                type="time" 
                                required 
                                value={requestedStartTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium text-slate-700">New End Time</label>
                            <Input 
                                type="time" 
                                required 
                                value={requestedEndTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Delivery Mode</label>
                        <Select value={requestedMode} onValueChange={(val) => setRequestedMode(val as typeof requestedMode)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OFFLINE">Offline (Physical Location)</SelectItem>
                                <SelectItem value="ONLINE">Online (Google Meet)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {requestedMode === "OFFLINE" ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Room / Location</label>
                            <Input 
                                type="text" 
                                placeholder="e.g. Room 2"
                                required 
                                value={requestedLocation}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedLocation(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Meeting Provider</label>
                                <Select value={requestedMeetingProvider} onValueChange={(val) => setRequestedMeetingProvider(val as typeof requestedMeetingProvider)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Google Meet URL</label>
                                <Input 
                                    type="url" 
                                    placeholder="https://meet.google.com/..."
                                    required 
                                    value={requestedMeetingUrl}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedMeetingUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Reason for Change (Required)</label>
                <Textarea 
                    placeholder="Please explain why this schedule change is necessary..."
                    required
                    rows={4}
                    value={reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Link href={`/teacher/classes/${session.courseClassId}/sessions/${session.id}`} className={cn(buttonVariants({ variant: "outline" }))}>
                    Cancel
                </Link>
                <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Request
                </Button>
            </div>
        </form>
    );
}
