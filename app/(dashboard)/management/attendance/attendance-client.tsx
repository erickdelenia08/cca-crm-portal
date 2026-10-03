"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Clock,
    FileSpreadsheet,
    FileText,
} from "lucide-react";

type StaffAttendance = {
    id: string;
    name: string;
    role: string;
    department: string | null;
    checkIn: Date | null;
    status: string;
};

export function AttendanceClient({ initialData }: { initialData: StaffAttendance[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");

    const handleExport = (format: "Excel" | "PDF") => {
        alert(`Exporting format ${format}... (to be implemented)`);
    };

    const filteredAttendance = initialData.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === "All" || item.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari staf atau ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Role:
                    </div>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Peran</option>
                        <option value="CONSULTANT">Consultant</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="PROCESSING_DEPARTMENT">Processor</option>
                        <option value="MANAGEMENT">Management</option>
                    </select>

                    <button
                        onClick={() => handleExport("Excel")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-colors shadow-2xs ml-4"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                    <button
                        onClick={() => handleExport("PDF")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>

            {/* Tabel Real-time Presensi */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Staf</th>
                                <th className="p-4">Jam Masuk</th>
                                <th className="p-4">Status Kehadiran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((staf) => (
                                    <tr key={staf.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{staf.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {staf.role} {staf.department ? `• ${staf.department}` : ''}
                                            </p>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-800">
                                            {staf.checkIn ? new Intl.DateTimeFormat("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZoneName: "short"
                                            }).format(new Date(staf.checkIn)) : "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    staf.status === "ON_TIME"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : staf.status === "LATE"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {staf.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">
                                        Tidak ada data presensi yang sesuai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
