"use client";

import { useState } from "react";
import {
    Search,
    UserPlus,
    X,
    Shield,
    KeyRound,
    UserCheck,
    UserX,
    Trash2,
    MoreVertical,
    AlertTriangle,
} from "lucide-react";
import { CreateUserForm } from "../forms/create-user-form";

export interface UserItem {
    id: string;
    autoId: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "CONSULTANT" | "MANAGEMENT";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    createdAt: string;
}

interface UserTableProps {
    users: UserItem[];
    onRefresh?: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // State Modal
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
    const [userToReset, setUserToReset] = useState<UserItem | null>(null);

    // Filter Logic
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.autoId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Action Handlers (Bisa dihubungkan ke Server Action / API Route kamu)
    const handleToggleStatus = async (user: UserItem) => {
        const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        // TODO: panggil API endpoint patch status (e.g. /api/users/[id]/status)
        console.log(`Mengubah status ${user.name} ke ${newStatus}`);
        setActiveMenuId(null);
        if (onRefresh) onRefresh();
    };

    const handleConfirmResetPassword = async () => {
        if (!userToReset) return;
        // TODO: panggil API endpoint reset password
        console.log(`Mengirim reset password ke ${userToReset.email}`);
        setUserToReset(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        // TODO: panggil API endpoint delete user (e.g. DELETE /api/users/[id])
        console.log(`Menghapus user permanen: ${userToDelete.id}`);
        setUserToDelete(null);
        if (onRefresh) onRefresh();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        User & Account Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola pembuatan akun dasar, peran akses (Role), status keaktifan, dan keamanan akun.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-2xs"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Buat Akun Baru</span>
                </button>
            </div>

            {/* Filter Panel */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari ID / Nama / Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-xs rounded-lg w-full focus:ring-blue-500 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Peran:</span>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-lg p-2 font-bold w-full sm:w-auto focus:ring-blue-500"
                    >
                        <option value="ALL">Semua Peran</option>
                        <option value="STUDENT">Siswa / Klien</option>
                        <option value="TEACHER">Pengajar (Teacher)</option>
                        <option value="CONSULTANT">Konsultan</option>
                        <option value="MANAGEMENT">Management / Admin</option>
                    </select>
                </div>
            </div>

            {/* Tabel Data User */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-visible">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-sm font-bold text-slate-800">Daftar Akun Terdaftar</h2>
                    <span className="text-xs text-slate-500 font-medium">
                        {filteredUsers.length} Pengguna Terfilter
                    </span>
                </div>

                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">ID Profile</th>
                                <th className="px-6 py-3">Nama & Email</th>
                                <th className="px-6 py-3">Peran (Role)</th>
                                <th className="px-6 py-3">Status Akun</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-700">
                                        {user.autoId || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900 text-xs">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md border ${user.role === "STUDENT"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : user.role === "TEACHER"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : user.role === "CONSULTANT"
                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                        : "bg-slate-100 text-slate-700 border-slate-300"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${user.status === "ACTIVE" ? "text-emerald-600" : "text-rose-500"
                                                }`}
                                        >
                                            {user.status === "ACTIVE" ? (
                                                <UserCheck className="w-3.5 h-3.5" />
                                            ) : (
                                                <UserX className="w-3.5 h-3.5" />
                                            )}
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center relative">
                                        <div className="flex items-center justify-center gap-1">
                                            {/* Shortcut: Reset Password */}
                                            <button
                                                onClick={() => setUserToReset(user)}
                                                title="Reset Password"
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <KeyRound className="w-4 h-4" />
                                            </button>

                                            {/* Dropdown Menu Aksi Lengkap */}
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenuId(activeMenuId === user.id ? null : user.id)
                                                    }
                                                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeMenuId === user.id && (
                                                    <>
                                                        {/* Overlay transparan untuk menutup menu saat klik di luar */}
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setActiveMenuId(null)}
                                                        />

                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 text-left">
                                                            {/* Toggle Status / Soft Delete */}
                                                            <button
                                                                onClick={() => handleToggleStatus(user)}
                                                                className="w-full px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                                                            >
                                                                {user.status === "ACTIVE" ? (
                                                                    <>
                                                                        <UserX className="w-3.5 h-3.5 text-orange-500" />
                                                                        <span>Nonaktifkan Akun</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                                        <span>Aktifkan Akun</span>
                                                                    </>
                                                                )}
                                                            </button>

                                                            <hr className="my-1 border-slate-100" />

                                                            {/* Hard Delete */}
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    setUserToDelete(user);
                                                                }}
                                                                className="w-full px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-rose-50 text-rose-600"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Hapus Permanen</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================== MODAL 1: BUAT AKUN BARU ==================== */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-900">Buat Akun Baru</h3>
                            <button
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <CreateUserForm
                                onSuccess={() => setIsAddUserModalOpen(false)}
                                onCancel={() => setIsAddUserModalOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL 2: KONFIRMASI RESET PASSWORD ==================== */}
            {userToReset && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4 text-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Reset Password User?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Link reset password akan dikirimkan ke email{" "}
                                <span className="font-semibold text-slate-800">{userToReset.email}</span>.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setUserToReset(null)}
                                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmResetPassword}
                                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
                            >
                                Kirim Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL 3: KONFIRMASI HARD DELETE (BAHAYA) ==================== */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4 text-center">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Hapus Akun Permanen?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Apakah Anda yakin ingin menghapus akun{" "}
                                <span className="font-semibold text-slate-800">{userToDelete.name}</span>? Tindakan
                                ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left">
                            <p className="text-[11px] text-amber-800 font-medium">
                                ⚠️ <span className="font-bold">Saran:</span> Jika user memiliki riwayat transaksi/kelas, sebaiknya gunakan opsi <span className="font-bold">Nonaktifkan Akun</span> agar data historis tidak rusak.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}