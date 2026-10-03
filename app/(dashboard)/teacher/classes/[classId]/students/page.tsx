import { cn } from "@/lib/utils";
import { getTeacherClassStudents } from "@/actions/teacher-portal.action";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, AlertCircle, CalendarDays, Phone } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function TeacherClassStudentsPage({
    params
}: {
    params: { classId: string }
}) {
    const { success, data: enrollments, error } = await getTeacherClassStudents(params.classId);

    if (!success || !enrollments) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Failed to load students: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Enrolled Students</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {enrollments.length} Students
                </span>
            </div>

            {enrollments.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-slate-500">
                        <Users className="w-10 h-10 mb-4 opacity-20" />
                        <p>No students enrolled in this class yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="hover:border-indigo-200 transition-colors">
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <Avatar className="w-16 h-16 mb-3 border border-slate-200">
                                    <AvatarImage src={enrollment.client.image || undefined} alt={enrollment.client.name || "Student"} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
                                        {enrollment.client.name?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <h4 className="font-semibold text-slate-900 mb-1 line-clamp-1">{enrollment.client.name}</h4>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full mb-4 ${enrollment.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                    {enrollment.status}
                                </span>
                                

                                <Link href={`/teacher/classes/${params.classId}/students/${enrollment.clientId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
                                        View Detail
                                    </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
