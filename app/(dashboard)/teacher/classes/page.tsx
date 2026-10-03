import { getTeacherClasses } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Clock, MapPin, ChevronRight, BookOpen, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function TeacherClassesPage() {
    const { success, data: classes, error } = await getTeacherClasses();

    if (!success || !classes) {
        return (
            <div className="p-6 flex-1">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <p>Failed to load classes: {error}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Classes</h2>
                <p className="text-slate-500 mt-2">Manage and view details of your assigned classes.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.length === 0 ? (
                    <Card className="col-span-full border-dashed">
                        <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-slate-500">
                            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                            <p>You have no assigned classes at the moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    classes.map((courseClass) => (
                        <Card key={courseClass.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{courseClass.course.name}</CardTitle>
                                        <CardDescription className="text-indigo-600 font-medium">
                                            {courseClass.code}
                                        </CardDescription>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${courseClass.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {courseClass.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 flex-1 flex flex-col">
                                <p className="text-sm font-medium text-slate-900 mb-4">{courseClass.name}</p>
                                
                                <div className="space-y-3 text-sm text-slate-600 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>Period</span>
                                        </div>
                                        <span className="font-medium text-slate-900">
                                            {new Date(courseClass.startDate).toLocaleDateString()} - {new Date(courseClass.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>Students</span>
                                        </div>
                                        <span className="font-medium text-slate-900">
                                            {courseClass._count.enrollments} / {courseClass.maxCapacity}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5 pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-700">Schedule Patterns</span>
                                        </div>
                                        {courseClass.schedulePatterns.length > 0 ? (
                                            <ul className="pl-6 list-disc text-slate-500">
                                                {courseClass.schedulePatterns.map(p => (
                                                    <li key={p.id}>
                                                        {p.dayOfWeek}: {new Date(p.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(p.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="pl-6 text-slate-500">No regular schedule set</span>
                                        )}
                                    </div>
                                </div>

                                <Link href={`/teacher/classes/${courseClass.id}`} className={cn(buttonVariants({ className: "w-full mt-auto bg-slate-50 hover:bg-slate-100 text-indigo-700 font-semibold border border-slate-200" }))}>
                                    View Class Details
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}