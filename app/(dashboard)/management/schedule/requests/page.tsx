import { getScheduleChangeRequests } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Video, MapPin, User, FileText, CheckCircle, XCircle } from "lucide-react";
import { ManagementScheduleRequestsClient } from "@/components/shared/management-schedule-requests-client";

export default async function ManagementScheduleRequestsPage() {
    const { success, data: requests, error } = await getScheduleChangeRequests();

    if (!success || !requests) {
        return (
            <div className="p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-red-700">
                        Failed to load schedule change requests: {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Schedule Change Requests</h2>
                <p className="text-slate-500 mt-2">Manage session schedule, mode, or location change requests from teachers.</p>
            </div>

            <ManagementScheduleRequestsClient initialRequests={requests} />
        </div>
    );
}
