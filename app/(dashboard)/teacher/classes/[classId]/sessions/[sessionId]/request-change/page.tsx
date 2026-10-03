import { cn } from "@/lib/utils";
import { getTeacherSession } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ScheduleChangeRequestForm } from "@/components/forms/schedule-change-request-form";

export default async function RequestScheduleChangePage({
    params
}: {
    params: { classId: string, sessionId: string }
}) {
    const { success, data: session, error } = await getTeacherSession(params.classId, params.sessionId);

    if (!success || !session) {
        notFound();
    }

    const activeRequest = session.scheduleRequests[0];

    return (
        <div className="space-y-6">
            <Link href={`/teacher/classes/${params.classId}/sessions/${session.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-2 -ml-4")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Session
                </Link>

            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Request Schedule Change</h2>
                <p className="text-slate-500 mt-2">Submit a request to Management to alter this session's schedule or location.</p>
            </div>

            {activeRequest && activeRequest.status === "PENDING" ? (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <h4 className="font-semibold text-amber-800">Request Already Pending</h4>
                        <p className="text-sm text-amber-700 mt-2">
                            You already have a pending schedule change request for this session. Please wait for Management to approve or reject it before submitting another request.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription>
                            {session.courseClass.course.name} ({session.courseClass.code})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScheduleChangeRequestForm session={session} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
