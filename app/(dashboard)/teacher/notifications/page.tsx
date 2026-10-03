import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function TeacherNotificationsPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h2>
                <p className="text-slate-500 mt-2">View alerts, announcements, and updates.</p>
            </div>

            <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-slate-500">
                    <Bell className="w-12 h-12 mb-4 opacity-20" />
                    <p>You have no new notifications.</p>
                </CardContent>
            </Card>
        </div>
    );
}
