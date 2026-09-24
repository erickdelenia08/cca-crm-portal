"use client";

import { useRouter } from "next/navigation";
import { CourseForm } from "@/components/forms/course-form";

export function CourseFormWrapper({ programId, productId }: { programId: string; productId: string }) {
    const router = useRouter();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Class Details</h2>
            </div>
            <CourseForm 
                initialData={{
                    programTypeId: productId,
                    code: "",
                    name: "",
                    category: "LANGUAGE",
                    level: "BASIC",
                    durationHours: 0,
                    basePrice: 0,
                    isActive: true,
                }}
                onSuccess={() => {
                    router.push(`/management/programs/${programId}/products/${productId}`);
                    router.refresh();
                }}
                onCancel={() => {
                    router.push(`/management/programs/${programId}/products/${productId}`);
                }}
            />
        </div>
    );
}
