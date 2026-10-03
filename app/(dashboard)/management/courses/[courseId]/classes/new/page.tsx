import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseClassForm } from "@/components/forms/course-class-form";

export default async function CreateCourseClassPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { programType: true }
    });

    if (!course) {
        return notFound();
    }

    const teachers = await prisma.staffProfile.findMany({
        where: {
            isActive: true,
            user: { role: "TEACHER" }
        },
        include: { user: true },
        orderBy: { fullName: "asc" }
    });

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
            <div className="mb-4">
                <Link href={`/management/courses/${courseId}`} className="text-xs text-blue-600 hover:underline">
                    ← Back to {course.name}
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Class / Batch</h1>
                <p className="text-sm text-gray-500 mb-6">Buka pendaftaran batch/kelas baru untuk kursus {course.name}.</p>

                <CourseClassForm
                    courseId={courseId}
                    teachers={teachers.map(t => ({
                        id: t.id,
                        name: t.fullName || t.user.name || "Unknown"
                    }))}
                />
            </div>
        </div>
    );
}
