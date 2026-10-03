import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, MapPin } from "lucide-react";

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function ClassSchedulePage({
    params,
}: {
    params: Promise<{ courseId: string; classId: string }>;
}) {
    const { courseId, classId } = await params;

    const courseClass = await prisma.courseClass.findUnique({
        where: { id: classId },
        include: {
            schedulePatterns: {
                orderBy: { dayOfWeek: "asc" }
            }
        }
    });

    if (!courseClass) return notFound();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Class Schedule Pattern</h2>
                        <p className="text-xs text-slate-500 mt-1">Pola jadwal rutin mingguan untuk kelas ini.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {courseClass.schedulePatterns.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-slate-400 text-sm">
                            Belum ada jadwal rutin yang dikonfigurasi.
                        </div>
                    ) : (
                        courseClass.schedulePatterns.map(pattern => (
                            <div key={pattern.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                            <span className="font-bold text-slate-800 text-sm">{DAYS[pattern.dayOfWeek]}</span>
                                        </div>
                                        {pattern.isActive ? (
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200">ACTIVE</span>
                                        ) : (
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded border border-slate-300">INACTIVE</span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {pattern.startTime} - {pattern.endTime}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            {pattern.defaultMode} {pattern.defaultLocation ? `(${pattern.defaultLocation})` : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
