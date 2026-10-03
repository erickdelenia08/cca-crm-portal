"use client";

import { useRouter } from "next/navigation";
import { CourseClassForm } from "@/components/forms/course-class-form";

export function CourseClassFormWrapper({
    programId,
    productId,
    courseId,
    teachers,
}: {
    programId: string;
    productId: string;
    courseId: string;
    teachers: { id: string; fullName: string }[];
}) {
    const router = useRouter();

    return (
        <CourseClassForm
            courseId={courseId}
            teachers={teachers.map(t => ({
                id: t.id,
                name: t.fullName || "Unknown"
            }))}
            onSuccess={() => {
                router.push(`/management/programs/${programId}/products/${productId}`);
                router.refresh();
            }}
            onCancel={() => {
                router.push(`/management/programs/${programId}/products/${productId}`);
            }}
        />
    );
}
