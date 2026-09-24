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
    teachers: { id: string; name: string }[];
}) {
    const router = useRouter();

    return (
        <CourseClassForm
            courseId={courseId}
            teachers={teachers}
            onSuccess={() => {
                // Navigate back to the course details (or product details)
                router.push(`/management/programs/${programId}/products/${productId}`);
                router.refresh();
            }}
            onCancel={() => {
                router.push(`/management/programs/${programId}/products/${productId}`);
            }}
        />
    );
}
