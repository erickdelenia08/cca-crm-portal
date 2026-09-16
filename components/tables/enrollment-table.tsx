"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    UserPlus,
    Search,
    BookOpen,
    BriefcaseBusiness,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Users,
} from "lucide-react";
import { UnifiedEnrollmentRecord } from "@/actions/enrollment.action";

const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        className: string;
        icon: React.ReactNode;
    }
> = {
    ONBOARDING: {
        label: "Onboarding",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock className="w-3.5 h-3.5" />,
    },

    PROCESSING: {
        label: "Processing",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock className="w-3.5 h-3.5" />,
    },

    ACTIVE: {
        label: "Active",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },

    COMPLETED: {
        label: "Completed",
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },

    CANCELLED: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="w-3.5 h-3.5" />,
    },
};

export function EnrollmentTable({ initialData }: { initialData: UnifiedEnrollmentRecord[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"ALL" | "PROGRAM" | "COURSE">("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filteredEnrollments = useMemo(() => {
        const keyword = searchTerm.toLowerCase().trim();

        return initialData.filter((item) => {
            const matchesType = activeFilter === "ALL" || item.type === activeFilter;
            const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

            const searchableText = [
                item.clientName,
                item.clientEmail,
                item.programTitle ?? "",
                item.courseTitle ?? "",
                item.className ?? "",
                item.consultantName ?? "",
                item.teacherName ?? "",
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = keyword === "" || searchableText.includes(keyword);

            return matchesType && matchesStatus && matchesSearch;
        });
    }, [initialData, searchTerm, activeFilter, statusFilter]);

    const totalProgram = initialData.filter((item) => item.type === "PROGRAM").length;
    const totalCourse = initialData.filter((item) => item.type === "COURSE").length;
    const totalActive = initialData.filter(
        (item) => item.status === "ACTIVE" || item.status === "PROCESSING" || item.status === "ONBOARDING"
    ).length;

    const handleRowClick = (item: UnifiedEnrollmentRecord) => {
        const type = item.type.toLowerCase();
        router.push(`/management/enrollments/${item.id}?type=${type}`);
    };

    return (
        <div className="space-y-6">
            {/* =====================================================
                HEADER
            ===================================================== */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Enrollment</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola pendaftaran client untuk program dan course.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                            href="/management/enrollments/program/create"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            <BriefcaseBusiness className="w-4 h-4" />
                            Program Enrollment
                        </Link>
                        <Link
                            href="/management/enrollments/course/create"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors border border-gray-300 shadow-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            Course Enrollment
                        </Link>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SUMMARY CARDS
            ===================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    type="button"
                    onClick={() => {
                        setActiveFilter("ALL");
                        setStatusFilter("ALL");
                    }}
                    className={`text-left bg-white p-5 rounded-xl border shadow-sm transition-all ${activeFilter === "ALL" && statusFilter === "ALL"
                        ? "border-blue-400 ring-1 ring-blue-400"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Enrollment</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{initialData.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveFilter("PROGRAM");
                        setStatusFilter("ALL");
                    }}
                    className={`text-left bg-white p-5 rounded-xl border shadow-sm transition-all ${activeFilter === "PROGRAM" && statusFilter === "ALL"
                        ? "border-blue-400 ring-1 ring-blue-400"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Program</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalProgram}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveFilter("COURSE");
                        setStatusFilter("ALL");
                    }}
                    className={`text-left bg-white p-5 rounded-xl border shadow-sm transition-all ${activeFilter === "COURSE" && statusFilter === "ALL"
                        ? "border-blue-400 ring-1 ring-blue-400"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Course</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCourse}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveFilter("ALL");
                        setStatusFilter("ACTIVE");
                    }}
                    className={`text-left bg-white p-5 rounded-xl border shadow-sm transition-all ${statusFilter === "ACTIVE"
                        ? "border-blue-400 ring-1 ring-blue-400"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalActive}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </button>
            </div>

            {/* =====================================================
                SEARCH + FILTER
            ===================================================== */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                        <input
                            type="text"
                            placeholder="Cari client, program, course, kelas, atau PIC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value as "ALL" | "PROGRAM" | "COURSE")}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">Semua Jenis</option>
                        <option value="PROGRAM">Program</option>
                        <option value="COURSE">Course</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="ONBOARDING">Onboarding</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* =====================================================
                TABLE
            ===================================================== */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Jenis</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">PIC / Kelas</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-4 py-4 w-10" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <p className="font-medium text-gray-700">Tidak ada enrollment</p>
                                        <p className="text-sm text-gray-400 mt-1">Coba ubah pencarian atau filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((item) => {
                                    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG["ONBOARDING"];
                                    const isProgram = item.type === "PROGRAM";

                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleRowClick(item)}
                                            className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {item.clientName}
                                                </p>
                                                <p className="text-xs text-gray-400">{item.clientEmail}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isProgram ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                        <BriefcaseBusiness className="w-3.5 h-3.5" />
                                                        Program
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        Course
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">
                                                    {isProgram ? item.programTitle : item.courseTitle}
                                                </p>
                                                {!isProgram && item.className && (
                                                    <p className="text-xs text-gray-400 mt-1 font-mono">Kelas: {item.className}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] text-gray-400 uppercase font-semibold">
                                                    {isProgram ? "Consultant" : "Teacher"}
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {isProgram ? item.consultantName || "-" : item.teacherName}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors inline-block" />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                    Menampilkan <strong className="text-gray-600">{filteredEnrollments.length}</strong> dari{" "}
                    <strong className="text-gray-600">{initialData.length}</strong> enrollment
                </span>
                <span>Program dan Course memiliki workflow enrollment yang terpisah.</span>
            </div>
        </div>
    );
}
