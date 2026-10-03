import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookOpen, Users, Calendar, ListChecks, ArrowLeft } from "lucide-react";

export default async function ClassLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId },
        include: { course: true }
    });

    if (!courseClass) return notFound();

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 font-sans space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Link href="/management/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
                <span>/</span>
                <Link href={`/management/courses/${courseId}`} className="hover:text-blue-600 transition-colors">{courseClass.course.name}</Link>
                <span>/</span>
                <span className="text-slate-800">{courseClass.name || courseClass.code}</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{courseClass.name || "Untitled Class"}</h1>
                    <div className="flex items-center gap-2 text-sm font-mono text-slate-500 font-semibold mb-3">
                        {courseClass.code}
                    </div>
                    {courseClass.isActive ? (
                        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                            ACTIVE
                        </span>
                    ) : (
                        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                            INACTIVE
                        </span>
                    )}
                </div>
            </div>

            <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-1">
                <Link href={`/management/courses/${courseId}/classes/${classId}`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 border-b-2 border-transparent focus:outline-none">
                    <BookOpen className="w-4 h-4" /> Overview
                </Link>
                <Link href={`/management/courses/${courseId}/classes/${classId}/teachers`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 border-b-2 border-transparent focus:outline-none">
                    <Users className="w-4 h-4" /> Teachers
                </Link>
                <Link href={`/management/courses/${courseId}/classes/${classId}/schedule`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 border-b-2 border-transparent focus:outline-none">
                    <Calendar className="w-4 h-4" /> Schedule
                </Link>
                <Link href={`/management/courses/${courseId}/classes/${classId}/sessions`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 border-b-2 border-transparent focus:outline-none">
                    <ListChecks className="w-4 h-4" /> Sessions
                </Link>
            </div>

            <div className="pt-2">
                {children}
            </div>
        </div>
    );
}
