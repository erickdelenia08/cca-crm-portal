import React from "react";
import { getClientEnrollment, ClientEnrollmentDetail } from "@/actions/client-portal.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, BookOpen, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ClientEnrollmentDetailPage({
    params
}: {
    params: Promise<{ enrollmentId: string }>;
}) {
    const { enrollmentId } = await params;
    const res = await getClientEnrollment(enrollmentId);

    if (!res.success || !res.data) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6 text-center">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {res.error || "Enrollment tidak ditemukan."}
                </div>
                <Link href="/client/services" className="text-indigo-600 font-semibold underline">
                    Kembali ke Layanan Saya
                </Link>
            </div>
        );
    }

    const enrollment = res.data;
    const isService = enrollment.programType.deliveryType === "SERVICE";

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Link href="/client/services" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Kembali ke Layanan Saya
            </Link>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-indigo-100">
                                {enrollment.programType.program.name}
                            </span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                                isService ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"
                            )}>
                                {enrollment.programType.deliveryType}
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{enrollment.programType.name}</h1>
                        <p className="text-slate-500 mt-1 font-medium">Tanggal Daftar: {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-sm font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm shrink-0">
                        Status: <span className="text-indigo-700">{enrollment.status}</span>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {isService ? (
                        <ServiceDetails enrollment={enrollment} />
                    ) : (
                        <CourseDetails enrollment={enrollment} />
                    )}
                </div>
            </div>
        </div>
    );
}

function ServiceDetails({ enrollment }: { enrollment: ClientEnrollmentDetail }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Konsultan Utama
                    </h3>
                    {enrollment.consultant ? (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                                {enrollment.consultant.name?.[0] || "?"}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{enrollment.consultant.name}</p>
                                <p className="text-sm text-slate-500">{enrollment.consultant.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">Belum ada konsultan yang ditugaskan.</p>
                    )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Aksi Cepat
                    </h3>
                    <div className="flex flex-col gap-2">
                        <Link href={`/client/advisory?enrollmentId=${enrollment.id}`} className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex justify-between items-center">
                            Lihat Jadwal Advisory <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                        <Link href={`/client/documents?enrollmentId=${enrollment.id}`} className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex justify-between items-center">
                            Unggah Dokumen Syarat <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                        <Link href={`/client/bookings/new?enrollmentId=${enrollment.id}`} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex justify-between items-center shadow-sm">
                            Buat Jadwal Baru <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CourseDetails({ enrollment }: { enrollment: ClientEnrollmentDetail }) {
    const courseClass = enrollment.courseEnrollments?.[0]?.courseClass;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Detail Kelas
                    </h3>
                    {courseClass ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-500 font-semibold mb-0.5">Nama Kelas</p>
                                <p className="font-bold text-slate-900">{courseClass.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold mb-0.5">Mata Kursus</p>
                                <p className="font-bold text-slate-900">{courseClass.course.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold mb-0.5">Pengajar (Teacher)</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                                        {courseClass.teacher?.user?.name?.[0] || "?"}
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm">{courseClass.teacher?.user?.name || "Belum ada pengajar"}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">Kamu belum dimasukkan ke dalam kelas (batch) manapun.</p>
                    )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Aktivitas Kelas
                    </h3>
                    <div className="flex flex-col gap-2">
                        {enrollment.courseEnrollments?.[0] ? (
                            <>
                                <Link href={`/client/classes/${enrollment.courseEnrollments[0].id}`} className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex justify-between items-center">
                                    Lihat Jadwal & Sesi <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                                <Link href={`/client/classes/${enrollment.courseEnrollments[0].id}/materials`} className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex justify-between items-center">
                                    Materi Pembelajaran <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500 italic py-2">Tunggu hingga kamu dialokasikan ke suatu kelas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
