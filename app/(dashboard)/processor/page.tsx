import { getProcessorDashboard } from "@/actions/processor-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { AttendanceCard } from "@/components/attendance/attendance-card";

export default async function ProcessorDashboardPage() {
    const { success, data: summary, error } = await getProcessorDashboard();

    if (!success || !summary) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Dashboard</h3>
                <p>{error || "Unknown error occurred"}</p>
            </div>
        );
    }

    const cards = [
        {
            title: "Pending Review",
            value: summary.pendingReview,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Needs Re-upload",
            value: summary.needsReupload,
            icon: RefreshCw,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Missing Documents",
            value: summary.missingDocuments,
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            title: "Verified Today",
            value: summary.completedToday,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Processing Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of your document processing queue</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <AttendanceCard />
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
                    {cards.map((card, i) => (
                        <Card key={i} className="border-slate-200 shadow-xs">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {card.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <card.icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}