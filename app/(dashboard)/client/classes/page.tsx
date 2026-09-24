import { ComponentProps } from "react";
import { getStudentClasses } from "@/actions/student-class.action";
import { ClassesClient } from "@/components/shared/classes-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
    const res = await getStudentClasses();

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

    const enrollments = res.data as unknown as ComponentProps<typeof ClassesClient>["enrollments"];
    if (!enrollments) return null;

    return (
        <ClassesClient 
            enrollments={enrollments}
        />
    );
}