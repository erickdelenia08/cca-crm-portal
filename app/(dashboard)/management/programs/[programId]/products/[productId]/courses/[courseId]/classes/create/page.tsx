import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourseById } from "@/actions/course.action";
import { getTeachers } from "@/actions/user.action";
import { CourseClassFormWrapper } from "@/components/forms/course-class-form-wrapper";

export default async function CreateCourseClassPage({
    params,
}: {
    params: Promise<{ programId: string; productId: string; courseId: string }>;
}) {
    const { programId, productId, courseId } = await params;
    
    // Validate that the course exists
    const course = await getCourseById(courseId);
    if (!course || course.programTypeId !== productId) {
        return notFound();
    }

    const teachers = await getTeachers();

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans space-y-6">
            <div>
                <Link href={`/management/programs/${programId}/products/${productId}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mb-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Product
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">Buka Kelas Baru</h1>
                <p className="text-xs text-slate-500 mt-1">
                    Membuka operational batch/rombel untuk Blueprint Course: <strong className="uppercase text-slate-800">{course.name} ({course.code})</strong>.
                </p>
            </div>

            <CourseClassFormWrapper 
                programId={programId} 
                productId={productId} 
                courseId={courseId} 
                teachers={teachers} 
            />
        </div>
    );
}
