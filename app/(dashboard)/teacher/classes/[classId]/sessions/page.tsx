import { cn } from "@/lib/utils";
import { getTeacherSessions } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, Users, Video, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function TeacherClassSessionsPage({
    params
}: {
    params: { classId: string }
}) {
    const { success, data: sessions, error } = await getTeacherSessions(params.classId);

    if (!success || !sessions) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Failed to load sessions: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Teaching Sessions</h3>
                {/* Future implementation: Add Session button if business rules permit teachers to create extra sessions */}
            </div>

            {sessions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-slate-500">
                        <Calendar className="w-10 h-10 mb-4 opacity-20" />
                        <p>No sessions have been scheduled for this class yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session, index) => {
                        const isPast = new Date(session.startTime) < new Date();
                        const attendanceRecorded = session._count.attendances > 0;
                        
                        return (
                            <Card key={session.id} className="hover:border-indigo-200 transition-colors">
                                <CardContent className="p-0 sm:flex items-center">
                                    <div className="p-6 sm:w-1/4 sm:border-r border-b sm:border-b-0 bg-slate-50 rounded-tl-lg rounded-bl-lg sm:rounded-tr-none sm:rounded-bl-none flex flex-col justify-center items-center text-center">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Session {index + 1}</span>
                                        <span className="text-2xl font-bold text-slate-900">{new Date(session.startTime).getDate()}</span>
                                        <span className="text-sm font-medium text-slate-600">{new Date(session.startTime).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    
                                    <div className="p-6 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-lg text-slate-900">{session.title}</h4>
                                                
                                                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600 mt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5">
                                                        {session.mode === "ONLINE" ? (
                                                            <><Video className="w-4 h-4 text-slate-400" /> {session.meetingProvider === "GOOGLE_MEET" ? "Google Meet" : "Online"}</>
                                                        ) : (
                                                            <><MapPin className="w-4 h-4 text-slate-400" /> {session.location || "Room not set"}</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 items-end">
                                                {isPast ? (
                                                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${attendanceRecorded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                        {attendanceRecorded ? (
                                                            <><CheckCircle2 className="w-3.5 h-3.5" /> Attendance Recorded</>
                                                        ) : (
                                                            <><AlertCircle className="w-3.5 h-3.5" /> Pending Attendance</>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                                        Upcoming
                                                    </div>
                                                )}
                                                
                                                <Link href={`/teacher/classes/${params.classId}/sessions/${session.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2")}>
                                                        Manage Session
                                                    </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


