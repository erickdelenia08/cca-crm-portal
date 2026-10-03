import { auth } from "@/auth";
import { getMyLeaveRequests } from "@/actions/hr.action";
import { redirect } from "next/navigation";
import { LeaveClient } from "@/app/(dashboard)/consultant/leave/leave-client";

export const dynamic = "force-dynamic";

export default async function LeavePage() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    const requests = await getMyLeaveRequests();

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengajuan Izin & Cuti</h1>
                <p className="text-sm text-slate-500 mt-1">Kelola dan ajukan permohonan izin atau cuti tahunan.</p>
            </div>
            
            <LeaveClient initialRequests={requests.success ? (requests.data || []) : []} />
        </div>
    );
}
