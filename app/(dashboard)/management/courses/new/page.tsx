import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCreateWizard } from "@/components/forms/course-create-wizard";

export default async function CreateCoursePage() {
    const programs = await prisma.program.findMany({
        where: { isActive: true },
        include: {
            programTypes: {
                where: { isActive: true, deliveryType: "COURSE" }
            }
        },
        orderBy: { name: "asc" }
    });
    
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 font-sans">
            <div className="mb-4">
                <Link href="/management/courses" className="text-xs text-blue-600 hover:underline">
                    ← Back to Courses
                </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Course</h1>
                <p className="text-sm text-gray-500 mb-6">Select a Program and Program Type to create a course.</p>
                
                <CourseCreateWizard programs={programs} />
            </div>
        </div>
    );
}
