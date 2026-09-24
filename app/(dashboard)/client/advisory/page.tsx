import { getAdvisoryData } from "@/actions/advisory.action";
import AdvisoryClient from "@/components/shared/advisory-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // Ensure the page is always server side

export default async function AdvisoryPage() {
    const res = await getAdvisoryData();

    if (!res.success) {
        if (res.error === "Unauthorized") {
            redirect("/login");
        }
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    <h2 className="font-bold mb-1">Gagal Memuat Data</h2>
                    <p className="text-sm">{res.error}</p>
                </div>
            </div>
        );
    }

    const { consultant, sessions, meetingNotes } = res.data!;

    return (
        <AdvisoryClient
            assignedConsultant={consultant}
            sessions={sessions}
            meetingNotes={meetingNotes}
        />
    );
}