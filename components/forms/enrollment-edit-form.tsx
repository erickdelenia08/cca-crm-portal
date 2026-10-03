"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEnrollmentStatus, cancelEnrollment } from "@/actions/enrollment.action";
import { EnrollmentStatus } from "@prisma/client";

export function EnrollmentEditForm({ enrollment }: { enrollment: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [status, setStatus] = useState<EnrollmentStatus>(enrollment.status);
    const [notes, setNotes] = useState(enrollment.notes || "");
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const isCourse = enrollment.programType.deliveryType === "COURSE";

    const handleUpdate = () => {
        setMessage(null);
        startTransition(async () => {
            try {
                await updateEnrollmentStatus(enrollment.id, status, notes);
                setMessage({ type: "success", text: "Enrollment updated successfully!" });
                setTimeout(() => router.push(`/management/enrollments/${enrollment.id}`), 1000);
            } catch (error: unknown) {
                setMessage({ type: "error", text: error instanceof Error ? error.message : String(error) });
            }
        });
    };

    const handleCancel = () => {
        if (!cancelReason.trim()) {
            setMessage({ type: "error", text: "Reason is required to cancel enrollment." });
            return;
        }
        setMessage(null);
        startTransition(async () => {
            try {
                await cancelEnrollment(enrollment.id, cancelReason);
                setMessage({ type: "success", text: "Enrollment cancelled." });
                setTimeout(() => router.push(`/management/enrollments/${enrollment.id}`), 1000);
            } catch (error: unknown) {
                setMessage({ type: "error", text: error instanceof Error ? error.message : String(error) });
            }
        });
    };

    return (
        <div className="space-y-6 text-sm">
            {message && (
                <div className={`p-4 rounded-md border font-medium ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {!isCancelling ? (
                <>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                            <select 
                                value={status} 
                                onChange={e => setStatus(e.target.value as EnrollmentStatus)} 
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {Object.values(EnrollmentStatus).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                            <textarea 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                placeholder="Add notes..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsCancelling(true)}
                            className="px-4 py-2 text-red-600 font-bold hover:underline"
                        >
                            Cancel Enrollment
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={isPending}
                            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h3 className="font-bold text-red-800 mb-2">Are you sure you want to cancel this enrollment?</h3>
                        <p className="text-red-700 text-xs mb-4">This action will change the status to CANCELLED. Please provide a reason.</p>
                        
                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Reason for Cancellation</label>
                        <textarea 
                            value={cancelReason} 
                            onChange={e => setCancelReason(e.target.value)} 
                            className="w-full bg-white border border-red-200 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all min-h-[100px]"
                            placeholder="Why is this being cancelled?"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsCancelling(false)}
                            disabled={isPending}
                            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            Go Back
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending || !cancelReason.trim()}
                            className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-sm"
                        >
                            {isPending ? "Cancelling..." : "Confirm Cancellation"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
