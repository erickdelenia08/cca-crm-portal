// "use client";

// import { useState } from "react";
// import {
//     Calendar,
//     Search,
//     Save,
//     CheckCircle2,
//     FileText,
//     X,
//     ExternalLink,
//     Eye
// } from "lucide-react";

// // Tipe Data Siswa
// interface Student {
//     id: string;
//     studentId: string;
//     name: string;
//     status: string;
//     permitReason?: string;
//     permitProofUrl?: string; // URL File Surat / Bukti Foto
// }

// export default function TeacherAttendancePage() {
//     const [selectedClass, setSelectedClass] = useState("c1");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isSaved, setIsSaved] = useState(false);

//     // State Modal Bukti Izin
//     const [selectedProof, setSelectedProof] = useState<{
//         name: string;
//         reason?: string;
//         proofUrl?: string;
//     } | null>(null);

//     const [students, setStudents] = useState<Student[]>([
//         { id: "s1", name: "Budi Santoso", studentId: "CCA-2026-000001", status: "HADIR" },
//         { id: "s2", name: "Siti Rahma", studentId: "CCA-2026-000002", status: "HADIR" },
//         {
//             id: "s3",
//             name: "Andi Pratama",
//             studentId: "CCA-2026-000003",
//             status: "IZIN",
//             permitReason: "Menghadiri Acara Keluarga di Luar Kota",
//             permitProofUrl: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&q=80&w=800" // Contoh Image URL
//         },
//         {
//             id: "s4",
//             name: "Dewi Lestari",
//             studentId: "CCA-2026-000004",
//             status: "SAKIT",
//             permitReason: "Demam Tinggi (Surat Dokter Terlampir)",
//             permitProofUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
//         },
//         { id: "s5", name: "Rian Hidayat", studentId: "CCA-2026-000005", status: "ALPA" },
//     ]);

//     const handleStatusChange = (id: string, newStatus: string) => {
//         setIsSaved(false);
//         setStudents((prev) =>
//             prev.map((student) => (student.id === id ? { ...student, status: newStatus } : student))
//         );
//     };

//     const filteredStudents = students.filter(
//         (s) =>
//             s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="space-y-6 p-6 max-w-7xl mx-auto relative">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Kehadiran Siswa</h1>
//                     <p className="text-sm text-slate-500 mt-1">Catat dan kelola kehadiran siswa serta periksa bukti perizinan.</p>
//                 </div>

//                 {isSaved && (
//                     <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg">
//                         <CheckCircle2 className="w-4 h-4" /> Presensi Berhasil Disimpan!
//                     </div>
//                 )}
//             </div>

//             {/* Control Panel */}
//             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
//                 <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                     <div>
//                         <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Kelas</label>
//                         <select
//                             value={selectedClass}
//                             onChange={(e) => setSelectedClass(e.target.value)}
//                             className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500 font-medium"
//                         >
//                             <option value="c1">IELTS Intensive - Batch 12</option>
//                             <option value="c2">TOEFL iBT - Batch 05</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Sesi</label>
//                         <input
//                             type="date"
//                             defaultValue="2026-09-09"
//                             className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 w-full sm:w-auto focus:ring-blue-500 focus:border-blue-500 font-medium"
//                         />
//                     </div>
//                 </div>

//                 <button
//                     onClick={() => setIsSaved(true)}
//                     className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-2xs"
//                 >
//                     <Save className="w-4 h-4" />
//                     <span>Simpan Presensi</span>
//                 </button>
//             </div>

//             {/* Tabel Siswa */}
//             <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
//                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                     <h2 className="text-sm font-bold text-slate-800">Daftar Siswa</h2>
//                     <div className="relative w-full sm:w-60">
//                         <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
//                         <input
//                             type="text"
//                             placeholder="Cari nama / ID..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 text-xs rounded-lg w-full focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-slate-600">
//                         <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 border-b border-slate-200">
//                             <tr>
//                                 <th className="px-6 py-3">ID Siswa</th>
//                                 <th className="px-6 py-3">Nama Lengkap</th>
//                                 <th className="px-6 py-3 text-center">Status Kehadiran</th>
//                                 <th className="px-6 py-3 text-center">Detail Perizinan</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {filteredStudents.map((student) => (
//                                 <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
//                                     <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">
//                                         {student.studentId}
//                                     </td>
//                                     <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>

//                                     {/* Status Switcher */}
//                                     <td className="px-6 py-4">
//                                         <div className="flex justify-center gap-1.5">
//                                             {["HADIR", "IZIN", "SAKIT", "ALPA"].map((statusOption) => (
//                                                 <button
//                                                     key={statusOption}
//                                                     onClick={() => handleStatusChange(student.id, statusOption)}
//                                                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${student.status === statusOption
//                                                         ? statusOption === "HADIR"
//                                                             ? "bg-emerald-600 text-white border-emerald-600"
//                                                             : statusOption === "IZIN"
//                                                                 ? "bg-amber-500 text-white border-amber-500"
//                                                                 : statusOption === "SAKIT"
//                                                                     ? "bg-indigo-600 text-white border-indigo-600"
//                                                                     : "bg-rose-600 text-white border-rose-600"
//                                                         : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
//                                                         }`}
//                                                 >
//                                                     {statusOption}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </td>

//                                     {/* Tombol Bukti Izin */}
//                                     <td className="px-6 py-4 text-center">
//                                         {(student.status === "IZIN" || student.status === "SAKIT") && student.permitProofUrl ? (
//                                             <button
//                                                 onClick={() =>
//                                                     setSelectedProof({
//                                                         name: student.name,
//                                                         reason: student.permitReason,
//                                                         proofUrl: student.permitProofUrl,
//                                                     })
//                                                 }
//                                                 className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
//                                             >
//                                                 <Eye className="w-3.5 h-3.5" /> Lihat Bukti
//                                             </button>
//                                         ) : (
//                                             <span className="text-xs text-slate-400 font-medium">-</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* POP-UP MODAL: Bukti Izin / Surat Dokter */}
//             {selectedProof && (
//                 <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
//                     <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-4">

//                         {/* Modal Header */}
//                         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
//                             <div>
//                                 <h3 className="text-sm font-bold text-slate-900">Bukti Perizinan Siswa</h3>
//                                 <p className="text-xs text-slate-500">{selectedProof.name}</p>
//                             </div>
//                             <button
//                                 onClick={() => setSelectedProof(null)}
//                                 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>

//                         {/* Modal Body */}
//                         <div className="p-5 space-y-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
//                                     Alasan / Keterangan:
//                                 </label>
//                                 <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
//                                     {selectedProof.reason || "Tidak ada keterangan."}
//                                 </p>
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                                     Lampiran File / Surat:
//                                 </label>
//                                 {selectedProof.proofUrl ? (
//                                     <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
//                                         <img
//                                             src={selectedProof.proofUrl}
//                                             alt="Bukti Izin"
//                                             className="object-cover w-full h-full"
//                                         />
//                                         <a
//                                             href={selectedProof.proofUrl}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
//                                         >
//                                             <ExternalLink className="w-4 h-4" /> Buka Ukuran Penuh
//                                         </a>
//                                     </div>
//                                 ) : (
//                                     <div className="text-xs text-slate-400 italic p-4 text-center border border-dashed rounded-lg">
//                                         Tidak ada bukti gambar terlampir.
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Modal Footer */}
//                         <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
//                             <button
//                                 onClick={() => setSelectedProof(null)}
//                                 className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
//                             >
//                                 Tutup
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Clock,
    MapPin,
    CheckCircle2,
    Calendar,
    FileText,
    UserCheck,
    LogOut,
    ArrowRight,
    Building
} from "lucide-react";

export default function MyAttendancePage() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

    // Simulasi Aksi Check-In
    const handleCheckIn = () => {
        const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setCheckInTime(time);
        setIsCheckedIn(true);
    };

    // Simulasi Aksi Check-Out
    const handleCheckOut = () => {
        const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setCheckOutTime(time);
    };

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Mandiri (Self Check-In)</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Catat jam kedatangan dan kepulangan Anda untuk tugas hari ini.
                    </p>
                </div>

                {/* Shortcut ke Halaman Izin/Cuti */}
                <Link
                    href="/teacher/my-attendance/permits"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-slate-200"
                >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Pengajuan Izin / Cuti</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
            </div>

            {/* Card Utama: Action Check-In / Out */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                {/* Kolom 1: Status Presensi Hari Ini */}
                <div className="space-y-1.5 md:border-r border-slate-100 pr-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Kehadiran</span>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isCheckedIn ? (checkOutTime ? "bg-slate-400" : "bg-emerald-500 animate-pulse") : "bg-amber-500"}`} />
                        <h2 className="text-lg font-bold text-slate-800">
                            {!isCheckedIn ? "Belum Check-In" : checkOutTime ? "Selesai Bertugas" : "Sudah Check-In"}
                        </h2>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1 font-medium pt-1">
                        <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Masuk: <span className="font-semibold text-slate-700">{checkInTime || "--:--"}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                            <LogOut className="w-3.5 h-3.5 text-slate-400" />
                            Keluar: <span className="font-semibold text-slate-700">{checkOutTime || "--:--"}</span>
                        </p>
                    </div>
                </div>

                {/* Kolom 2: Lokasi / Geofencing Check */}
                <div className="space-y-1.5 md:border-r border-slate-100 pr-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Presensi</span>
                    <div className="flex items-center gap-1.5 text-slate-800 text-sm font-bold">
                        <Building className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Gedung Utama - Kampus A</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        Terdeteksi di dalam area kantor (Radius 0m)
                    </p>
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1">
                        GPS Terverifikasi
                    </span>
                </div>

                {/* Kolom 3: Tombol Eksekusi */}
                <div className="flex flex-col gap-2">
                    {!isCheckedIn ? (
                        <button
                            onClick={handleCheckIn}
                            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs"
                        >
                            <UserCheck className="w-4 h-4" /> Check-In Masuk
                        </button>
                    ) : !checkOutTime ? (
                        <button
                            onClick={handleCheckOut}
                            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs"
                        >
                            <LogOut className="w-4 h-4" /> Check-Out Selesai
                        </button>
                    ) : (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                            Presensi hari ini telah lengkap. Terima kasih atas dedikasi Anda!
                        </div>
                    )}
                </div>
            </div>

            {/* Daftar Tugas & Sesi Hari Ini */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">Jadwal Tugas & Kelas Hari Ini</h2>
                    <span className="text-xs font-medium text-slate-500 font-mono">Rabu, 9 September 2026</span>
                </div>

                <div className="divide-y divide-slate-100">

                    {/* Item Kelas 1 */}
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mb-1">
                                    MENGAJAR KELAS
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">IELTS Intensive - Batch 12</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Ruang 201 • Sesi 4 (Writing Task 2)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                09:00 - 10:30 WIB
                            </span>

                            {/* Shortcut menuju Halaman Absen Siswa */}
                            <Link
                                href="/teacher/classes/c1/attendance"
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                            >
                                Absen Siswa <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Item Sesi Konsultasi 2 */}
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mb-1">
                                    SESI KONSULTASI
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">Konsultasi Beasiswa - Budi Santoso</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Ruang Konsultasi B • Personal Statement Review</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                13:00 - 14:00 WIB
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}