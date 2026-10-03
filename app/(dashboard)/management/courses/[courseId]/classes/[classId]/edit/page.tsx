import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseClassEditForm } from "@/components/forms/course-class-edit-form";

export default async function EditClassPage({
    params,
}: {
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId }
    });

    if (!courseClass) return notFound();

    const teachers = await prisma.staffProfile.findMany({
        where: { 
            isActive: true,
            user: { role: "TEACHER" } 
        },
        include: { user: true },
        orderBy: { fullName: "asc" }
    });

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Edit Detail Kelas</h2>
            <CourseClassEditForm courseClass={courseClass} teachers={teachers} />
        </div>
    );
}
