import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById } from "@/actions/course.action";
import { GraduationCap, Building2, CheckCircle2, Edit3, XCircle, Users, Clock, CalendarDays, Plus } from "lucide-react";

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    
    // Fetch data using Server Action
    const course = await getCourseById(courseId);

    if (!course) {
        return notFound();
    }

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="space-y-3">
                <Link
                    href="/management/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    ← Back to Courses
                </Link>
            </div>

            {/* Course Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{course.name}</h1>
                            {course.isActive ? (
                                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                    ACTIVE
                                </span>
                            ) : (
                                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                                    INACTIVE
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mt-1">
                            {course.code}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-4 text-sm font-semibold text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                {course.programType.program.name} <span className="text-slate-300">/</span> {course.programType.name}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/management/courses/${course.id}/edit`}
                        className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Course
                    </Link>
                </div>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold mb-1">Kategori / Level</div>
                    <div className="text-sm font-bold text-slate-800">{course.category || "-"} <span className="text-slate-400 mx-1">|</span> {course.level || "-"}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold mb-1">Durasi</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Clock className="w-4 h-4 text-blue-500" /> {course.durationHours ? `${course.durationHours} Jam` : "-"}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold mb-1">Total Pertemuan</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <CalendarDays className="w-4 h-4 text-indigo-500" /> {course.totalSessions ? `${course.totalSessions} Sesi` : "-"}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold mb-1">Base Price</div>
                    <div className="text-sm font-bold text-emerald-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(course.basePrice))}
                    </div>
                </div>
            </div>

            {course.description && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 leading-relaxed">
                    <strong className="block text-xs text-slate-500 mb-2">Deskripsi:</strong>
                    {course.description}
                </div>
            )}

            {/* Classes Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Classes / Batches</h2>
                        <p className="text-xs text-slate-500 mt-1">Kelola kelas aktif, histori batch, dan jadwal pertemuan.</p>
                    </div>
                    <Link
                        href={`/management/courses/${course.id}/classes/new`}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Buka Batch Kelas
                    </Link>
                </div>
                
                <div className="p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Nama Kelas & Kode</th>
                                <th className="p-4">Periode</th>
                                <th className="p-4">Pengajar Utama</th>
                                <th className="p-4 text-center">Kapasitas</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {course.classes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Belum ada batch kelas yang dibuka untuk course ini.</p>
                                    </td>
                                </tr>
                            ) : (
                                course.classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <Link href={`/management/courses/${course.id}/classes/${cls.id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline block">
                                                {cls.name || "Untitled Class"}
                                            </Link>
                                            <div className="text-[10px] font-mono font-semibold text-slate-400 mt-0.5">{cls.code}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-semibold text-slate-700">
                                                {new Date(cls.startDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })} - 
                                                <br />{new Date(cls.endDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-bold text-slate-800">{cls.teacher.user.name}</div>
                                        </td>
                                        <td className="p-4 text-center font-semibold text-slate-700">
                                            {cls._count.enrollments} / {cls.maxCapacity}
                                        </td>
                                        <td className="p-4 text-center">
                                            {cls.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-200">
                                                    <XCircle className="w-3 h-3" /> INACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/management/courses/${course.id}/classes/${cls.id}`}
                                                className="inline-flex text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Kelola Kelas →
                                            </Link>
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
