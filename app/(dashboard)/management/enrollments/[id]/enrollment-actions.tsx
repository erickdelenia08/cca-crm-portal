"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEnrollmentStatus, deleteEnrollment } from "@/actions/enrollment.action";

interface EnrollmentActionsProps {
    enrollmentId: string;
    type: "PROGRAM" | "COURSE";
    status: string;
}

export function EnrollmentActions({ enrollmentId, type, status }: EnrollmentActionsProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCancel = () => {
        if (!window.confirm("Apakah Anda yakin ingin membatalkan enrollment ini?")) return;
        
        startTransition(async () => {
            try {
                await updateEnrollmentStatus(enrollmentId, type, "CANCELLED");
            } catch (error) {
                console.error("Gagal membatalkan enrollment", error);
                alert("Terjadi kesalahan saat membatalkan enrollment.");
            }
        });
    };

    const handleReactivate = () => {
        if (!window.confirm("Apakah Anda yakin ingin melanjutkan enrollment ini?")) return;
        
        startTransition(async () => {
            try {
                // Change back to ACTIVE (or ONBOARDING if needed, but ACTIVE is safe)
                await updateEnrollmentStatus(enrollmentId, type, "ACTIVE");
            } catch (error) {
                console.error("Gagal melanjutkan enrollment", error);
                alert("Terjadi kesalahan saat melanjutkan enrollment.");
            }
        });
    };

    const handleDelete = () => {
        if (!window.confirm("PERINGATAN: Tindakan ini akan menghapus enrollment secara permanen. Lanjutkan?")) return;
        
        startTransition(async () => {
            try {
                await deleteEnrollment(enrollmentId, type);
                router.push("/management/enrollments");
            } catch (error) {
                console.error("Gagal menghapus enrollment", error);
                alert("Terjadi kesalahan saat menghapus enrollment.");
            }
        });
    };

    return (
        <div className="flex items-center gap-3">
            {status === "CANCELLED" ? (
                <>
                    <button 
                        onClick={handleReactivate}
                        disabled={isPending}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Memproses..." : "Lanjutkan Enrollment"}
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={isPending}
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Memproses..." : "Hapus Permanen"}
                    </button>
                </>
            ) : (
                <button 
                    onClick={handleCancel}
                    disabled={isPending}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Memproses..." : "Batalkan Enrollment"}
                </button>
            )}
        </div>
    );
}
