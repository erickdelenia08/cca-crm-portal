import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCourseById, getCourseClasses, getTeachers } from "@/actions/course-class.action";
import { CourseClassList } from "@/components/tables/course-class-list";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Manajemen Kelas | CRM Student Portal",
    description: "Kelola jadwal, pengajar, dan tanggal pelaksanaan kelas",
};

export default async function CourseClassesPage({ params }: { params: { id: string } }) {
    // In newer Next.js versions params might need to be awaited, but usually this pattern is safe or we can await it if needed
    // If it's a promise, we should `await params`
    const { id } = await params;
    
    const course = await getCourseById(id);
    if (!course) {
        notFound();
    }

    const classes = await getCourseClasses(id);
    const teachersData = await getTeachers();
    
    const teachers = teachersData.map(t => ({
        id: t.id,
        name: t.user.name || t.fullName || "Unknown",
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/management/courses"
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Manajemen Kelas / Batch</h1>
                    <p className="text-xs text-slate-500">
                        Kelola jadwal, pengajar, dan tanggal pelaksanaan kelas
                    </p>
                </div>
            </div>

            {/* Header Banner: Menampilkan Informasi Course & Base Price */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex justify-between items-center shadow-sm">
                <div>
                    <span className="text-xs font-semibold bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-md">
                        {course.code}
                    </span>
                    <h2 className="text-lg font-bold mt-1.5">{course.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Level: {course.level || "-"}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">
                        Harga Dasar Kursus
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                        Rp {course.basePrice.toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            <CourseClassList courseId={course.id} classes={classes} teachers={teachers} />
        </div>
    );
}