import { getTeacherClass } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays, Users, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function TeacherClassOverviewPage({
    params
}: {
    params: { classId: string }
}) {
    const { success, data: courseClass } = await getTeacherClass(params.classId);

    if (!success || !courseClass) {
        notFound();
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Class Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-indigo-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Academic Period</p>
                            <p className="text-sm text-slate-500">
                                {new Date(courseClass.startDate).toLocaleDateString()} - {new Date(courseClass.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-indigo-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Capacity & Enrollment</p>
                            <p className="text-sm text-slate-500">
                                {courseClass._count.enrollments} enrolled out of {courseClass.maxCapacity} max capacity
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Status</p>
                            <p className="text-sm text-slate-500">
                                {courseClass.isActive ? "Active and ongoing" : "Inactive or completed"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Regular Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    {courseClass.schedulePatterns.length > 0 ? (
                        <div className="space-y-4">
                            {courseClass.schedulePatterns.map(pattern => (
                                <div key={pattern.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-md border flex items-center justify-center font-bold text-indigo-700">
                                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][pattern.dayOfWeek] || "???"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][pattern.dayOfWeek] || "Unknown"}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {new Date(pattern.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(pattern.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-slate-500 mt-4 italic">
                                This is the default schedule. Individual sessions might have requested changes.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                            <Clock className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-sm">No regular schedule set for this class.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
