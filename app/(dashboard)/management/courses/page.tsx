import Link from "next/link";
import { getCourses } from "@/actions/course.action";
import { CourseTable } from "@/components/tables/course-table";

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                    <p className="text-sm text-gray-500">Kelola kursus, kelas, jadwal, dan sesi belajar.</p>
                </div>
                <Link
                    href="/management/courses/new"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all"
                >
                    + Create Course
                </Link>
            </div>

            <CourseTable courses={courses as unknown as React.ComponentProps<typeof CourseTable>['courses']} />
        </div>
    );
}