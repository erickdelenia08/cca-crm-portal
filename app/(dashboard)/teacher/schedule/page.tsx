import { getTeacherSchedule } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon, Video, MapPin, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function TeacherSchedulePage() {
    const { success, data: sessions, error } = await getTeacherSchedule();

    if (!success || !sessions) {
        return (
            <div className="p-6 flex-1">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-red-700">
                        Failed to load schedule: {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Group sessions by Date string
    const grouped = sessions.reduce((acc, session) => {
        const dateKey = new Date(session.startTime).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(session);
        return acc;
    }, {} as Record<string, typeof sessions>);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Teaching Schedule</h2>
                <p className="text-slate-500 mt-2">Your upcoming teaching sessions across all assigned classes.</p>
            </div>

            {Object.keys(grouped).length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-slate-500">
                        <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>You have no upcoming sessions scheduled.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.entries(grouped).map(([dateStr, daySessions]) => {
                        const dateObj = new Date(dateStr);
                        const isToday = dateObj.toDateString() === new Date().toDateString();
                        
                        return (
                            <div key={dateStr} className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b pb-2">
                                    <CalendarIcon className="w-5 h-5 text-indigo-500" />
                                    {isToday ? "Today, " : ""}
                                    {dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {daySessions.map(session => (
                                        <Card key={session.id} className={`hover:border-indigo-300 transition-colors ${isToday ? 'border-indigo-100 bg-indigo-50/30' : ''}`}>
                                            <CardContent className="p-5 flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-full mb-2 inline-block">
                                                            {session.mode}
                                                        </span>
                                                        <h4 className="font-semibold text-slate-900 text-lg leading-tight line-clamp-2">
                                                            {session.courseClass.course.name}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 line-clamp-1">{session.courseClass.name}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mt-2 mb-6 text-sm text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-indigo-500" />
                                                        <span className="font-medium text-slate-900">
                                                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {session.mode === "ONLINE" ? (
                                                            <>
                                                                <Video className="w-4 h-4 text-indigo-500" />
                                                                <span>{session.meetingProvider === "GOOGLE_MEET" ? "Google Meet" : "Online"}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                                <span>{session.location || "Room not set"}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-indigo-500" />
                                                        <span className="line-clamp-1">{session.title}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-auto pt-4 flex gap-2 w-full">
                                                    <Link href={`/teacher/classes/${session.courseClassId}/sessions/${session.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm", className: "flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50" }))}>
                                                        Manage
                                                    </Link>
                                                    
                                                    {session.mode === "ONLINE" && session.meetingUrl && (
                                                        <a href={session.meetingUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "sm", className: "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" }))}>
                                                            Join
                                                        </a>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
