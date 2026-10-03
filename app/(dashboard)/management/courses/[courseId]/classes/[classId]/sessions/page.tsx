import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListChecks, Clock, User } from "lucide-react";

export default async function ClassSessionsPage({
    params,
}: {
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId },
        include: {
            sessions: {
                orderBy: { startTime: "asc" }
            },
            teacher: {
                include: { user: true }
            }
        }
    });

    if (!courseClass) return notFound();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ListChecks className="w-5 h-5 text-indigo-600" />
                            Generated Sessions
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Daftar sesi belajar yang telah di-generate berdasarkan jadwal rutin.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-4 border-b border-slate-200">Sesi</th>
                                <th className="py-3 px-4 border-b border-slate-200">Tanggal</th>
                                <th className="py-3 px-4 border-b border-slate-200">Waktu</th>
                                <th className="py-3 px-4 border-b border-slate-200">Pengajar</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-center">Status Mode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {courseClass.sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                                        Belum ada sesi yang ter-generate.
                                    </td>
                                </tr>
                            ) : (
                                courseClass.sessions.map((session, index) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-semibold text-slate-800">
                                            {session.title || `Sesi ${index + 1}`}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-600">
                                            {new Date(session.startTime).toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-semibold text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(session.startTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                {courseClass.teacher.user.name}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">
                                                {session.mode}
                                            </span>
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
