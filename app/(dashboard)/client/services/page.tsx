import React from "react";
import Link from "next/link";
import { getClientEnrollments, ClientEnrollmentSummary } from "@/actions/client-portal.action";
import { Briefcase, ArrowRight, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientServicesPage() {
    const res = await getClientEnrollments();
    const enrollments = res.data || [];

    if (!res.success) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    Failed to load your services: {res.error}
                </div>
            </div>
        );
    }

    if (enrollments.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <Briefcase className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">You don't have any active services yet.</h2>
                    <p className="text-slate-500 max-w-sm mb-6">You are currently not enrolled in any programs or services.</p>
                </div>
            </div>
        );
    }

    // Group enrollments by status (Active vs Completed vs Cancelled)
    const active = enrollments.filter(e => !["COMPLETED", "CANCELLED"].includes(e.status));
    const completed = enrollments.filter(e => e.status === "COMPLETED");
    const cancelled = enrollments.filter(e => e.status === "CANCELLED");

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Services</h1>
                <p className="text-slate-500 mt-2">Manage your current enrollments, classes, and advisory services.</p>
            </div>

            {active.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Active Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {active.map(enrollment => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}

            {completed.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Completed Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completed.map(enrollment => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}
            
            {cancelled.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Cancelled Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cancelled.map(enrollment => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function EnrollmentCard({ enrollment }: { enrollment: ClientEnrollmentSummary }) {
    const isService = enrollment.programType.deliveryType === "SERVICE";
    const courseClass = enrollment.courseEnrollments?.[0]?.courseClass;

    return (
        <div className={cn(
            "flex flex-col bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow",
            enrollment.status === "COMPLETED" ? "border-emerald-200" :
            enrollment.status === "CANCELLED" ? "border-red-200" : "border-slate-200"
        )}>
            <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 items-center mb-1">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {enrollment.programType.program.name}
                            </span>
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                                isService ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {enrollment.programType.deliveryType}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{enrollment.programType.name}</h3>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                        {enrollment.status}
                    </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                    {isService && enrollment.consultant ? (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Consultant: <strong>{enrollment.consultant.name}</strong></span>
                        </div>
                    ) : null}

                    {!isService && courseClass ? (
                        <>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-400" />
                                <span>Class: <strong>{courseClass.name}</strong></span>
                            </div>
                            {courseClass.teacher && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>Teacher: <strong>{courseClass.teacher.user?.name}</strong></span>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 mt-auto">
                <Link
                    href={`/client/services/${enrollment.id}`}
                    className="flex items-center justify-between w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
