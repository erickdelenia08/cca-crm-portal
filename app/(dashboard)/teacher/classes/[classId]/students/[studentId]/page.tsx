import { cn } from "@/lib/utils";
import { getTeacherStudent } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, CalendarDays, ArrowLeft, Calendar, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function TeacherStudentDetailPage({
    params
}: {
    params: { classId: string, studentId: string }
}) {
    const { success, data: enrollment, error } = await getTeacherStudent(params.classId, params.studentId);

    if (!success || !enrollment) {
        notFound();
    }

    const { client } = enrollment;

    return (
        <div className="space-y-6">
            <Link href={`/teacher/classes/${params.classId}/students`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-2 -ml-4")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Students
                </Link>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 mb-4 border-2 border-slate-200">
                            <AvatarImage src={client.image || undefined} alt={client.name || "Student"} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-bold">
                                {client.name?.[0] || "?"}
                            </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-xl font-bold text-slate-900">{client.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{client.email}</p>
                        
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-6 ${enrollment.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                            {enrollment.status}
                        </span>

                        <div className="w-full space-y-4 text-left border-t pt-4">
                            {client.clientProfile?.phone && (
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-indigo-500" />
                                    <span>{client.clientProfile.phone}</span>
                                </div>
                            )}
                            {client.clientProfile?.dateOfBirth && (
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                                    <span>{new Date(client.clientProfile.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span>Attendance History in this Class</span>
                            <span className="text-sm font-normal text-slate-500">
                                Total: {client.courseAttendances?.length || 0} records
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!client.courseAttendances || client.courseAttendances.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                                <Calendar className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No attendance records found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {client.courseAttendances.map((att: any) => {
                                    let StatusIcon = CheckCircle2;
                                    let statusColor = "text-emerald-500";
                                    
                                    if (att.status === "LATE") {
                                        statusColor = "text-amber-500";
                                        StatusIcon = AlertCircle;
                                    } else if (att.status === "ABSENT") {
                                        statusColor = "text-red-500";
                                        StatusIcon = XCircle;
                                    } else if (att.status === "EXCUSED") {
                                        statusColor = "text-indigo-500";
                                        StatusIcon = AlertCircle;
                                    }

                                    return (
                                        <div key={att.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-slate-50">
                                            <div>
                                                <p className="font-semibold text-slate-900">{att.session.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(att.session.startTime).toLocaleDateString()} at {new Date(att.session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className={`flex items-center gap-2 mt-2 sm:mt-0 font-medium ${statusColor}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span>{att.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
