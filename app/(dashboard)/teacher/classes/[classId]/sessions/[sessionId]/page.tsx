import { getTeacherSession } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Video, MapPin, ArrowLeft, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { TeacherAttendanceForm } from "@/components/forms/teacher-attendance-form";
import { getTeacherClassStudents, getTeacherAttendance, TeacherStudentList, TeacherAttendanceRecords } from "@/actions/teacher-portal.action";

export default async function TeacherSessionDetailPage({
    params
}: {
    params: { classId: string, sessionId: string }
}) {
    const { success, data: session, error } = await getTeacherSession(params.classId, params.sessionId);

    if (!success || !session) {
        notFound();
    }

    const isPast = new Date(session.startTime) < new Date();
    const activeRequest = session.scheduleRequests[0];

    // Fetch required data for attendance form if session has started
    let students: TeacherStudentList = [];
    let attendances: TeacherAttendanceRecords = [];
    if (isPast) {
        const [studentsRes, attendancesRes] = await Promise.all([
            getTeacherClassStudents(params.classId),
            getTeacherAttendance(params.sessionId)
        ]);
        if (studentsRes.success) students = studentsRes.data;
        if (attendancesRes.success) attendances = attendancesRes.data;
    }

    return (
        <div className="space-y-6">
            <Link href={`/teacher/classes/${params.classId}/sessions`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-2 -ml-4")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sessions
                </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{session.title}</h2>
                    <p className="text-slate-500 text-lg mt-1">{session.courseClass.course.name} ({session.courseClass.code})</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Link href={`/teacher/classes/${params.classId}/sessions/${session.id}/request-change`} className={cn(buttonVariants({ variant: "outline", size: "default" }))}>
                            <Edit className="w-4 h-4 mr-2" />
                            Request Change
                        </Link>
                </div>
            </div>

            {activeRequest && activeRequest.status === "PENDING" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <div className="flex-1">
                        <h4 className="font-semibold text-amber-800">Pending Schedule Change Request</h4>
                        <p className="text-sm text-amber-700 mt-1">
                            You have requested to change this session to {new Date(activeRequest.requestedStartTime).toLocaleString()}. Waiting for Management approval.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Session Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-900">Date</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-900">Time</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            {session.mode === "ONLINE" ? (
                                <Video className="w-5 h-5 text-indigo-500 mt-0.5" />
                            ) : (
                                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    {session.mode === "ONLINE" ? "Online Meeting" : "Physical Location"}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {session.mode === "ONLINE" ? (session.meetingProvider === "GOOGLE_MEET" ? "Google Meet" : "Online") : (session.location || "Not specified")}
                                </p>
                                
                                {session.mode === "ONLINE" && session.meetingUrl && (
                                    <a href={session.meetingUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2 w-full")}>
                                            Join Meeting <ExternalLink className="w-3 h-3 ml-2" />
                                        </a>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Attendance & Operations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isPast ? (
                            <TeacherAttendanceForm 
                                sessionId={session.id} 
                                classId={session.courseClassId} 
                                students={students} 
                                initialAttendances={attendances} 
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Session hasn't started yet</h3>
                                <p className="text-slate-500 mt-2 max-w-sm">
                                    Attendance can only be recorded after the session has started or ended.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
