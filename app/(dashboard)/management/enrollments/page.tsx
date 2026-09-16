import React from "react";
import { getEnrollments } from "@/actions/enrollment.action";
import { EnrollmentTable } from "@/components/tables/enrollment-table";

export const dynamic = 'force-dynamic';

export default async function EnrollmentsPage() {
    const enrollments = await getEnrollments();

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <EnrollmentTable initialData={enrollments} />
            </div>
        </div>
    );
}