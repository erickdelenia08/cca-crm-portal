import { auth } from "@/auth";
import { getAllLeaveRequests } from "@/actions/hr-management.action";
import { redirect } from "next/navigation";
import { LeaveApprovalClient } from "./leave-approval-client";

export const dynamic = "force-dynamic";

export default async function ManagementLeavePage() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
        redirect("/login");
    }

    const requests = await getAllLeaveRequests();

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Persetujuan Izin & Cuti</h1>
                <p className="text-sm text-slate-500 mt-1">Kelola dan setujui pengajuan izin/cuti karyawan.</p>
            </div>
            
            <LeaveApprovalClient initialRequests={requests.success ? requests.data : []} />
        </div>
    );
}
