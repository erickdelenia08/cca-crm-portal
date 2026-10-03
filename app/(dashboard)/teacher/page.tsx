import { getTeacherDashboard } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users, Calendar, AlertCircle, Clock, Video, MapPin } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttendanceCard } from "@/components/attendance/attendance-card";

export default async function TeacherDashboardPage() {
    const { success, data: dashboard, error } = await getTeacherDashboard();

    if (!success || !dashboard) {
        return (
            <div className="p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-700">Failed to load dashboard: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-10 p-8 md:p-12 font-sans max-w-7xl mx-auto selection:bg-[#3b82f6] selection:text-white">
            <div className="border-b border-[#e2e8f0] pb-6">
                <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">Teacher Dashboard</h2>
                <p className="text-[#475569] mt-2 font-normal text-[15px]">Welcome back. Here is your teaching overview.</p>
            </div>

            {/* QUICK TAP IN CARD */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="col-span-4 md:col-span-1">
                    <AttendanceCard />
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <h3 className="text-[14px] font-semibold text-[#475569]">Active Classes</h3>
                        <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-[#4f46e5]" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#0f172a] tracking-tight">{dashboard.classesCount}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <h3 className="text-[14px] font-semibold text-[#475569]">Students</h3>
                        <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#0284c7]" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#0f172a] tracking-tight">{dashboard.studentsCount}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <h3 className="text-[14px] font-semibold text-[#475569]">Today's Sessions</h3>
                        <div className="w-10 h-10 rounded-lg bg-[#d1fae5] flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[#059669]" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#0f172a] tracking-tight">{dashboard.todaysSessions.length}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <h3 className="text-[14px] font-semibold text-[#475569]">Pending Attendance</h3>
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", dashboard.pendingAttendanceCount > 0 ? "bg-[#fef3c7]" : "bg-[#d1fae5]")}>
                            <AlertCircle className={cn("h-5 w-5", dashboard.pendingAttendanceCount > 0 ? "text-[#d97706]" : "text-[#059669]")} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#0f172a] tracking-tight">{dashboard.pendingAttendanceCount}</div>
                    <p className="text-[12px] text-[#64748b] mt-2 font-medium">Sessions missing attendance</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* TODAY'S CLASSES */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#f1f5f9]">
                        <h3 className="text-xl font-bold text-[#0f172a]">Today's Sessions</h3>
                        <p className="text-[14px] text-[#64748b] mt-1">
                            You have {dashboard.todaysSessions.length} session(s) scheduled for today.
                        </p>
                    </div>
                    <div className="p-6 flex-1">
                        {dashboard.todaysSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-[#94a3b8]">
                                <Calendar className="w-12 h-12 mb-4 opacity-30" />
                                <p className="font-medium text-[15px]">No sessions scheduled for today</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dashboard.todaysSessions.map(session => (
                                    <div key={session.id} className="flex flex-col p-5 border border-[#e2e8f0] rounded-xl hover:shadow-md transition-all duration-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-[#0f172a] text-[16px]">{session.courseClass.course.name}</h4>
                                                <p className="text-[14px] font-medium text-[#64748b] mt-1">{session.courseClass.name}</p>
                                            </div>
                                            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#e0e7ff] text-[#3730a3] rounded-full">
                                                {session.mode}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#f1f5f9] text-[13px] font-medium text-[#475569]">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-[#94a3b8]" />
                                                <span>
                                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {session.mode === "ONLINE" ? (
                                                    <>
                                                        <Video className="w-4 h-4 text-[#94a3b8]" />
                                                        <span>{session.meetingProvider === "GOOGLE_MEET" ? "Google Meet" : "Online"}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="w-4 h-4 text-[#94a3b8]" />
                                                        <span>{session.location || "Room not set"}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-5 flex gap-3">
                                            <Link href={`/teacher/classes/${session.courseClassId}/sessions/${session.id}`} className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#0f172a] text-[13px] font-bold rounded-lg transition-colors">
                                                View Session
                                            </Link>
                                            {session.mode === "ONLINE" && session.meetingUrl && (
                                                <a href={session.meetingUrl} target="_blank" rel="noreferrer" className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">
                                                    Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* UPCOMING SESSIONS */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#f1f5f9]">
                        <h3 className="text-xl font-bold text-[#0f172a]">Upcoming (Next 7 Days)</h3>
                    </div>
                    <div className="p-6 flex-1">
                        {dashboard.upcomingSessions.length === 0 ? (
                            <p className="text-[14px] font-medium text-[#64748b] text-center py-10">No upcoming sessions</p>
                        ) : (
                            <div className="space-y-4">
                                {dashboard.upcomingSessions.slice(0, 5).map(session => (
                                    <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f1f5f9] pb-4 last:border-0 last:pb-0 gap-4">
                                        <div>
                                            <p className="font-bold text-[#0f172a] text-[15px]">{session.courseClass.course.name}</p>
                                            <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748b] mt-1.5">
                                                <Calendar className="w-4 h-4 text-[#94a3b8]" />
                                                {new Date(session.startTime).toLocaleDateString()}
                                                <span className="w-1 h-1 rounded-full bg-[#cbd5e1] mx-1"></span>
                                                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <Link href={`/teacher/classes/${session.courseClassId}/sessions/${session.id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[13px] font-bold text-[#3b82f6] hover:bg-[#e0f2fe] transition-colors self-start sm:self-center">
                                            Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}