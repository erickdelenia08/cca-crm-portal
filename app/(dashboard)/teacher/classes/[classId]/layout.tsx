import { getTeacherClass } from "@/actions/teacher-portal.action";
import { BookOpen, Users, Calendar, Folder, FileCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function TeacherClassLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ classId: string }>;
}) {
    const resolvedParams = await params;
    const { success, data: courseClass, error } = await getTeacherClass(resolvedParams.classId);

    if (!success || !courseClass) {
        notFound();
    }

    const tabs = [
        { name: "Overview", href: `/teacher/classes/${resolvedParams.classId}`, icon: BookOpen },
        { name: "Students", href: `/teacher/classes/${resolvedParams.classId}/students`, icon: Users },
        { name: "Sessions", href: `/teacher/classes/${resolvedParams.classId}/sessions`, icon: Calendar },
        { name: "Materials", href: `/teacher/classes/${resolvedParams.classId}/materials`, icon: Folder },
        // { name: "Attendance", href: `/teacher/classes/${resolvedParams.classId}/attendance`, icon: FileCheck }, // usually part of session
    ];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-start justify-between border-b pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {courseClass.code}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${courseClass.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                            {courseClass.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{courseClass.course.name}</h2>
                    <p className="text-slate-500 text-lg mt-1">{courseClass.name}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                    <p><strong>Students:</strong> {courseClass._count.enrollments} / {courseClass.maxCapacity}</p>
                    <p className="mt-1">
                        <strong>Period:</strong> {new Date(courseClass.startDate).toLocaleDateString()} - {new Date(courseClass.endDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <nav className="flex space-x-2 border-b">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 border-b-2 border-transparent hover:text-indigo-600 hover:border-indigo-300 focus:outline-none focus:text-indigo-700 focus:border-indigo-700 active-tab-hack"
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </Link>
                ))}
            </nav>

            <div className="pt-4">
                {children}
            </div>
        </div>
    );
}
