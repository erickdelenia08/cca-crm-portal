import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseEditForm } from "@/components/forms/course-edit-form";


export default async function EditCoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            programType: {
                include: { program: true }
            }
        }
    });

    if (!course) return notFound();

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 font-sans">
            <div className="mb-4">
                <Link href={`/management/courses/${courseId}`} className="text-xs text-blue-600 hover:underline">
                    ← Back to Course Detail
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Course</h1>
                <p className="text-sm text-gray-500 mb-6">Update informasi kursus {course.name}.</p>

                <CourseEditForm course={course} />
            </div>
        </div>
    );
}
