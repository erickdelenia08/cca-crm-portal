import { ComponentProps } from "react";
import { getProcessorDashboardData } from "@/actions/document.action";
import { ProcessingDashboardClient } from "@/components/shared/processing-dashboard-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProcessingDashboardPage() {
    const res = await getProcessorDashboardData();

    if (!res.success) {
        if (res.error === "Unauthorized") {
            redirect("/login");
        }
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    <h2 className="font-bold mb-1">Gagal Memuat Data Dashboard</h2>
                    <p className="text-sm">{res.error}</p>
                </div>
            </div>
        );
    }

    const rawData = res.data;
    if (!rawData) return null;

    // Convert groupBy array to record map
    const countsMap: Record<string, number> = {};
    rawData.counts.forEach((item: { status: string; _count: { id: number } }) => {
        countsMap[item.status] = item._count.id;
    });

    const priorityDocuments = rawData.priorityDocuments as unknown as ComponentProps<typeof ProcessingDashboardClient>["priorityDocuments"];

    return (
        <ProcessingDashboardClient 
            counts={countsMap as ComponentProps<typeof ProcessingDashboardClient>["counts"]} 
            priorityDocuments={priorityDocuments} 
            lastUpdated={new Date()} 
        />
    );
}