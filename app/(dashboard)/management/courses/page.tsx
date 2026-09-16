import { getCourses } from "@/actions/course.action";
import { CourseTable } from "@/components/tables/course-table";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manajemen Kursus | CRM Student Portal",
    description: "Kelola katalog kursus, durasi, dan base price",
};

export default async function CoursesManagementPage() {
    const courses = await getCourses();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <CourseTable courses={courses} />
        </div>
    );
}