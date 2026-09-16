import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    BriefcaseBusiness,
    GraduationCap,
    CheckCircle2,
    Clock3,
    AlertCircle,
    FileText,
    Pencil,
} from "lucide-react";
import { getProgramEnrollmentById, getCourseEnrollmentById } from "@/actions/enrollment.action";
import { EnrollmentStatus, CourseEnrollmentStatus } from "@prisma/client";
import { EnrollmentActions } from "./enrollment-actions";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    ONBOARDING: {
        label: "Onboarding",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock3,
    },
    PROCESSING: {
        label: "Processing",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock3,
    },
    ACTIVE: {
        label: "Active",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CheckCircle2,
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle,
    },
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

function formatDate(date: string | Date) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 font-medium text-gray-900">{value}</p>
        </div>
    );
}

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}

export default async function EnrollmentDetailPage({ params, searchParams }: PageProps) {
    const id = (await params).id;
    const type = (await searchParams).type?.toUpperCase() === "COURSE" ? "COURSE" : "PROGRAM";

    let enrollmentData: any = null;

    if (type === "PROGRAM") {
        enrollmentData = await getProgramEnrollmentById(id);
    } else {
        enrollmentData = await getCourseEnrollmentById(id);
    }

    if (!enrollmentData) {
        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href="/management/enrollments"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Enrollment
                    </Link>

                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                        <AlertCircle className="mx-auto mb-4 text-gray-400" size={42} />
                        <h1 className="text-xl font-semibold text-gray-900">Enrollment tidak ditemukan</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Data enrollment dengan ID <span className="font-medium">{id}</span> tidak ditemukan.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const statusConfig = STATUS_CONFIG[enrollmentData.status] || STATUS_CONFIG["ONBOARDING"];
    const StatusIcon = statusConfig.icon;

    // Derived Client Info
    const client = {
        name: enrollmentData.student.user.name,
        email: enrollmentData.student.user.email,
        phone: "-", // Can be pulled from profile if added later
        education: "-", // Can be pulled from profile
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-6">
                {/* HEADER */}
                <div className="mb-6">
                    <Link
                        href="/management/enrollments"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Enrollment
                    </Link>

                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">Detail Enrollment</h1>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.className}`}>
                                    <StatusIcon size={14} />
                                    {statusConfig.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                ID Enrollment: <span className="font-medium text-gray-700">{enrollmentData.id}</span>
                            </p>
                        </div>

                        {/* --- TAMBAHKAN TOMBOL ACTION DI SINI --- */}
                        <EnrollmentActions
                            enrollmentId={enrollmentData.id}
                            type={type}
                            status={enrollmentData.status}
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* CLIENT */}
                        <section className="rounded-xl border border-gray-200 bg-white">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h2 className="font-semibold text-gray-900">Informasi Client</h2>
                            </div>
                            <div className="grid gap-5 p-6 md:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2">
                                        <User size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Nama Client</p>
                                        <p className="mt-1 font-medium text-gray-900">{client.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2">
                                        <Mail size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="mt-1 font-medium text-gray-900">{client.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2">
                                        <Phone size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">No. Telepon</p>
                                        <p className="mt-1 font-medium text-gray-900">{client.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2">
                                        <GraduationCap size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Pendidikan</p>
                                        <p className="mt-1 font-medium text-gray-900">{client.education}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SERVICE */}
                        <section className="rounded-xl border border-gray-200 bg-white">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h2 className="font-semibold text-gray-900">
                                    {type === "PROGRAM" ? "Informasi Program" : "Informasi Course"}
                                </h2>
                            </div>
                            <div className="p-6">
                                {type === "PROGRAM" && (
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <InfoItem label="Program" value={enrollmentData.program.name} />
                                        <InfoItem label="Kode" value={enrollmentData.program.code || "-"} />
                                        <InfoItem label="Program Type" value={enrollmentData.program.type.name} />
                                        <InfoItem label="Destination" value={enrollmentData.program.destination || "-"} />
                                    </div>
                                )}

                                {type === "COURSE" && (
                                    <div className="space-y-6">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <InfoItem label="Course" value={enrollmentData.courseClass.course.title} />
                                            <InfoItem label="Kode" value={enrollmentData.courseClass.course.code} />
                                            <InfoItem label="Category" value={enrollmentData.courseClass.course.category} />
                                            <InfoItem label="Level" value={enrollmentData.courseClass.course.level} />
                                        </div>

                                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                                        Class / Batch
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                                        {enrollmentData.courseClass.code}
                                                    </h3>
                                                </div>
                                                <div className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                                                    Max: {enrollmentData.courseClass.maxCapacity} peserta
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <InfoItem label="Teacher" value={enrollmentData.courseClass.teacher?.user.name || "-"} />
                                                <InfoItem label="Jadwal" value={enrollmentData.courseClass.schedule || "-"} />
                                                <InfoItem label="Mulai" value={formatDate(enrollmentData.courseClass.startDate)} />
                                                <InfoItem label="Selesai" value={formatDate(enrollmentData.courseClass.endDate)} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* DOCUMENTS — PROGRAM ONLY */}
                        {type === "PROGRAM" && (
                            <section className="rounded-xl border border-gray-200 bg-white">
                                <div className="border-b border-gray-100 px-6 py-4">
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="font-semibold text-gray-900">Dokumen Persyaratan</h2>
                                            <p className="mt-1 text-sm text-gray-500">Daftar dokumen persyaratan dari Master Program.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">{enrollmentData.documentRequirements.length}</p>
                                            <p className="text-xs text-gray-500">Total Dokumen</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {enrollmentData.documentRequirements.map((document: any) => (
                                        <div key={document.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-lg bg-gray-100 p-2">
                                                    <FileText size={18} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-medium text-gray-900">{document.name}</h3>
                                                        {document.isRequired && (
                                                            <span className="text-xs text-red-500">Required</span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">{document.description || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {enrollmentData.documentRequirements.length === 0 && (
                                        <div className="p-6 text-center text-sm text-gray-500">
                                            Tidak ada dokumen persyaratan.
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        <section className="rounded-xl border border-gray-200 bg-white">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h2 className="font-semibold text-gray-900">Informasi Tambahan</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tanggal Pendaftaran</p>
                                    <p className="font-medium text-gray-900">{formatDate(enrollmentData.createdAt)}</p>
                                </div>
                                {type === "PROGRAM" && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Consultant / PIC</p>
                                        <p className="font-medium text-gray-900">{enrollmentData.consultant?.user.name || "-"}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Catatan Internal</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 whitespace-pre-wrap">
                                        {enrollmentData.notes || "Tidak ada catatan."}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main >
    );
}