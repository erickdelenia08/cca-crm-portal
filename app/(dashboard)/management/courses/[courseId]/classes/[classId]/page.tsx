import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit3 } from "lucide-react";

export default async function ClassOverviewPage({
    params,
}: {
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId },
        include: {
            teacher: { include: { user: true } },
            _count: { select: { enrollments: true, sessions: true } }
        }
    });

    console.log('iniiiiii classss');
    console.log(courseClass);
    console.log('iniiiiii params');
    console.log(params);

    if (!courseClass) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Link
                    href={`/management/courses/${courseId}/classes/${classId}/edit`}
                    className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                    <Edit3 className="w-4 h-4" /> Edit Detail Kelas
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Umum</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1">Periode Kelas</span>
                            <span className="text-sm font-bold text-slate-800">
                                {new Date(courseClass.startDate).toLocaleDateString("id-ID")} - {new Date(courseClass.endDate).toLocaleDateString("id-ID")}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1">Kapasitas</span>
                            <span className="text-sm font-bold text-slate-800">
                                {courseClass._count.enrollments} / {courseClass.maxCapacity} Peserta
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Status & Pengajar</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1">Pengajar Utama</span>
                            <span className="text-sm font-bold text-slate-800">{courseClass.teacher.user.name}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1">Total Sesi Ter-generate</span>
                            <span className="text-sm font-bold text-slate-800">{courseClass._count.sessions} Sesi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
