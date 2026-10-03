import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, History } from "lucide-react";

export default async function ClassTeachersPage({
    params,
}: {
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId },
        include: {
            teacher: { include: { user: true } },
            teacherAssignments: {
                include: { teacher: { include: { user: true } } },
                orderBy: { startDate: "desc" }
            }
        }
    });

    if (!courseClass) return notFound();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Pengajar Utama (Current Primary Teacher)</h3>
                        <p className="text-xs text-slate-500">Pengajar default yang terdaftar untuk kelas ini.</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">
                            {courseClass.teacher.user.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 text-sm">{courseClass.teacher.user.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{courseClass.teacher.position || "Teacher"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <History className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Assignment History & Substitutes</h3>
                        <p className="text-xs text-slate-500">Riwayat penugasan pengajar pengganti atau perubahan pengajar utama.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-4 border-b border-slate-200">Teacher</th>
                                <th className="py-3 px-4 border-b border-slate-200">Start Date</th>
                                <th className="py-3 px-4 border-b border-slate-200">End Date</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-center">Type</th>
                                <th className="py-3 px-4 border-b border-slate-200">Alasan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {courseClass.teacherAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-slate-400 text-sm">
                                        Tidak ada riwayat penugasan/pengganti.
                                    </td>
                                </tr>
                            ) : (
                                courseClass.teacherAssignments.map((assign) => (
                                    <tr key={assign.id}>
                                        <td className="py-3 px-4 font-semibold text-slate-800">
                                            {assign.teacher.user.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(assign.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-3 px-4">
                                            {assign.endDate ? new Date(assign.endDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {assign.isTemporary ? (
                                                <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">TEMPORARY</span>
                                            ) : (
                                                <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">PRIMARY</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-xs text-slate-500">
                                            {assign.reason || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
