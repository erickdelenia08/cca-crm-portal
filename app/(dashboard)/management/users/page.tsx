"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    UserPlus,
    UserCheck,
    UserX,
    Edit,
    Eye,
    Link,
    X,
    GraduationCap,
    Briefcase,
    Mail,
    Phone,
    Calendar,
    ShieldAlert,
    Save,
} from "lucide-react";

// Tipe Data Pengguna
type UserRole = "Student" | "Consultant";
type UserStatus = "Active" | "Inactive";

type UserItem = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    // Khusus Siswa
    assignedConsultant?: string;
    academicHistory?: string;
    targetMajor?: string;
    // Khusus Konsultan
    assignedStudentsCount?: number;
    specialization?: string;
};

export default function AdminUsersPage() {
    // Mock Data Pengguna
    const [users, setUsers] = useState<UserItem[]>([
        {
            id: "USR-001",
            name: "Siti Rahmawati",
            email: "siti.rahma@gmail.com",
            phone: "+62 812-3456-7890",
            role: "Student",
            status: "Active",
            assignedConsultant: "Budi Santoso",
            academicHistory: "S1 Teknik Informatika - Universitas Indonesia (IPK 3.75)",
            targetMajor: "MSc Computer Science - University of Edinburgh",
        },
        {
            id: "USR-002",
            name: "Ahmad Fauzi",
            email: "ahmad.fauzi@gmail.com",
            phone: "+62 857-1234-5678",
            role: "Student",
            status: "Active",
            assignedConsultant: "Dewi Lestari",
            academicHistory: "S1 Hubungan Internasional - UGM (IPK 3.60)",
            targetMajor: "Master of Public Policy - Oxford University",
        },
        {
            id: "USR-101",
            name: "Budi Santoso",
            email: "budi.santoso@edu.com",
            phone: "+62 811-9876-5432",
            role: "Consultant",
            status: "Active",
            assignedStudentsCount: 14,
            specialization: "STEM & LPDP Specialist",
        },
        {
            id: "USR-102",
            name: "Dewi Lestari",
            email: "dewi.lestari@edu.com",
            phone: "+62 813-8888-9999",
            role: "Consultant",
            status: "Active",
            assignedStudentsCount: 18,
            specialization: "Humanities & Chevening Specialist",
        },
    ]);

    // Tab & Filter State
    const [activeTab, setActiveTab] = useState<UserRole>("Student");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");

    // Modal States
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserItem | null>(null);
    const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<UserItem | null>(null);
    const [assignedConsultantName, setAssignedConsultantName] = useState("");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    // Form State Tambah/Edit User
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Student" as UserRole,
        specialization: "",
    });

    // Filter Logic
    const filteredUsers = users.filter((u) => {
        const matchesRole = u.role === activeTab;
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || u.status === statusFilter;
        return matchesRole && matchesSearch && matchesStatus;
    });

    // Handlers CRUD
    const handleToggleStatus = (id: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
            )
        );
    };

    const handleAssignConsultant = () => {
        if (!selectedStudentForAssign) return;
        setUsers((prev) =>
            prev.map((u) =>
                u.id === selectedStudentForAssign.id
                    ? { ...u, assignedConsultant: assignedConsultantName }
                    : u
            )
        );
        setSelectedStudentForAssign(null);
        alert(`Konsultan binaan berhasil diperbarui.`);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: UserItem = {
            id: `USR-${Math.floor(100 + Math.random() * 900)}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: "Active",
            specialization: formData.role === "Consultant" ? formData.specialization : undefined,
            assignedStudentsCount: formData.role === "Consultant" ? 0 : undefined,
        };
        setUsers((prev) => [newUser, ...prev]);
        setIsAddUserModalOpen(false);
        setFormData({ name: "", email: "", phone: "", role: "Student", specialization: "" });
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Manajemen Siswa & Konsultan
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola data akun, alokasi konsultan binaan, dan informasi profil pengaplikasi.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
                >
                    <UserPlus className="w-4 h-4" /> Tambah Akun Baru
                </button>
            </div>

            {/* Navigation Tabs & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-3">
                {/* Role Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab("Student")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "Student"
                            ? "bg-slate-900 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        Siswa ({users.filter((u) => u.role === "Student").length})
                    </button>
                    <button
                        onClick={() => setActiveTab("Consultant")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "Consultant"
                            ? "bg-slate-900 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        Konsultan ({users.filter((u) => u.role === "Consultant").length})
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={`Cari ${activeTab === "Student" ? "siswa" : "konsultan"}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
                    >
                        <option value="All">Semua Status</option>
                        <option value="Active">Aktif</option>
                        <option value="Inactive">Nonaktif</option>
                    </select>
                </div>
            </div>

            {/* Tabel Master Pengguna */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">ID & Nama</th>
                                <th className="p-4">Kontak</th>
                                {activeTab === "Student" ? (
                                    <>
                                        <th className="p-4">Target Studi</th>
                                        <th className="p-4">Konsultan Binaan</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-4">Spesialisasi</th>
                                        <th className="p-4">Total Siswa Binaan</th>
                                    </>
                                )}
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{u.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{u.id}</p>
                                        </td>
                                        <td className="p-4 space-y-0.5">
                                            <p className="text-slate-800">{u.email}</p>
                                            <p className="text-slate-400 text-[11px]">{u.phone}</p>
                                        </td>

                                        {activeTab === "Student" ? (
                                            <>
                                                <td className="p-4 font-medium text-slate-800 max-w-xs truncate">
                                                    {u.targetMajor || "-"}
                                                </td>
                                                <td className="p-4">
                                                    {u.assignedConsultant ? (
                                                        <span className="font-semibold text-slate-800">
                                                            {u.assignedConsultant}
                                                        </span>
                                                    ) : (
                                                        <span className="text-rose-500 text-[11px] italic font-semibold">
                                                            Belum di-assign
                                                        </span>
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-4 font-medium text-slate-800">
                                                    {u.specialization || "-"}
                                                </td>
                                                <td className="p-4 font-bold text-slate-900">
                                                    {u.assignedStudentsCount} Siswa
                                                </td>
                                            </>
                                        )}

                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                {/* Assign Button (Student Only) */}
                                                {activeTab === "Student" && (
                                                    <button
                                                        title="Assign Konsultan"
                                                        onClick={() => {
                                                            setSelectedStudentForAssign(u);
                                                            setAssignedConsultantName(u.assignedConsultant || "");
                                                        }}
                                                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                                                    >
                                                        <Link className="w-3.5 h-3.5" />
                                                    </button>
                                                )}

                                                {/* View Detail */}
                                                <button
                                                    title="Lihat Detail Profil"
                                                    onClick={() => setSelectedUserForDetail(u)}
                                                    className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Toggle Active Status */}
                                                <button
                                                    title={u.status === "Active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                                                    onClick={() => handleToggleStatus(u.id)}
                                                    className={`p-1.5 rounded-lg border transition-colors ${u.status === "Active"
                                                        ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                                                        : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                                        }`}
                                                >
                                                    {u.status === "Active" ? (
                                                        <UserX className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-400 text-xs">
                                        Tidak ada data pengguna ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DRAWER: READ-ONLY DETAIL PROFIL */}
            {selectedUserForDetail && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
                    <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                    {selectedUserForDetail.id}
                                </span>
                                <h2 className="text-lg font-bold text-slate-900 mt-2">
                                    {selectedUserForDetail.name}
                                </h2>
                                <p className="text-xs text-slate-500">Peran: {selectedUserForDetail.role}</p>
                            </div>
                            <button
                                onClick={() => setSelectedUserForDetail(null)}
                                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Read-Only Info Section */}
                        <div className="space-y-4 text-xs">
                            <div className="space-y-2">
                                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                                    Informasi Kontak
                                </label>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                                    <p className="flex items-center gap-2 text-slate-700">
                                        <Mail className="w-4 h-4 text-slate-400" /> {selectedUserForDetail.email}
                                    </p>
                                    <p className="flex items-center gap-2 text-slate-700">
                                        <Phone className="w-4 h-4 text-slate-400" /> {selectedUserForDetail.phone}
                                    </p>
                                </div>
                            </div>

                            {selectedUserForDetail.role === "Student" ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                                            Riwayat Akademik
                                        </label>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                                            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-slate-700">
                                                {selectedUserForDetail.academicHistory || "Belum diisi"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                                            Target Studi
                                        </label>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <p className="font-semibold text-slate-800">
                                                {selectedUserForDetail.targetMajor || "Belum diatur"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                                            Konsultan Binaan
                                        </label>
                                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-blue-900 font-semibold">
                                            {selectedUserForDetail.assignedConsultant || "Belum Dialokasikan"}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                                        Spesialisasi Konsultan
                                    </label>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-700">{selectedUserForDetail.specialization}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ASSIGN KONSULTAN TO SISWA */}
            {selectedStudentForAssign && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-sm">Assign Konsultan Binaan</h3>
                            <button
                                onClick={() => setSelectedStudentForAssign(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-600">
                            Pilih konsultan penanggung jawab untuk siswa{" "}
                            <strong className="text-slate-900">{selectedStudentForAssign.name}</strong>:
                        </p>

                        <select
                            value={assignedConsultantName}
                            onChange={(e) => setAssignedConsultantName(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="">-- Pilih Konsultan --</option>
                            {users
                                .filter((u) => u.role === "Consultant" && u.status === "Active")
                                .map((c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name} ({c.specialization})
                                    </option>
                                ))}
                        </select>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSelectedStudentForAssign(null)}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAssignConsultant}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                            >
                                Simpan Penugasan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: TAMBAH AKUN BARU */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <form
                        onSubmit={handleCreateUser}
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4"
                    >
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-sm">Tambah Akun Pengguna Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Peran Akun</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value as UserRole })
                                    }
                                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                                >
                                    <option value="Student">Siswa</option>
                                    <option value="Consultant">Konsultan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2"
                                />
                            </div>

                            {formData.role === "Consultant" && (
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Spesialisasi</label>
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        placeholder="mis. STEM & LPDP"
                                        className="w-full border border-slate-300 rounded-lg p-2"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                            >
                                Simpan Akun
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}