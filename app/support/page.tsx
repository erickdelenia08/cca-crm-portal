"use client";

import { useState } from "react";
import {
    Search,
    MessageSquare,
    HelpCircle,
    FileText,
    Send,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    Mail,
    LifeBuoy,
} from "lucide-react";

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Form Tiket State
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("teknis");
    const [description, setDescription] = useState("");

    // Mock Data FAQ
    const faqs = [
        {
            question: "Bagaimana cara melakukan Clock-In dan Clock-Out presensi?",
            answer:
                "Masuk ke menu Presensi di dashboard Anda. Tekan tombol 'Clock In' saat mulai bekerja dan 'Clock Out' saat selesai. Pastikan browser memberikan izin akses lokasi jika diperlukan.",
        },
        {
            question: "Kapan slip gaji diproses dan diterbitkan?",
            answer:
                "Slip gaji diproses secara otomatis oleh tim Finance pada tanggal 28 setiap bulannya. Anda dapat mengunduh dokumen versi PDF langsung dari halaman Payroll.",
        },
        {
            question: "Apa yang harus dilakukan jika saya lupa kata sandi akun?",
            answer:
                "Anda dapat melakukan reset kata sandi melalui halaman Login dengan menekan 'Lupa Password', atau masuk ke Pengaturan Profil > Keamanan jika Anda masih bisa login.",
        },
        {
            question: "Bagaimana cara mengajukan permohonan izin atau cuti?",
            answer:
                "Buka menu Presensi, pilih tab 'Pengajuan Izin & Cuti', isi tanggal serta alasan pengajuan, lalu klik 'Kirim Pengajuan'. Status pengajuan akan diperbarui secara real-time.",
        },
    ];

    // Mock Data Riwayat Tiket
    const [tickets, setTickets] = useState([
        {
            id: "TKT-8901",
            subject: "Kendala Gagal Upload Lampiran Cuti",
            category: "Teknis & Sistem",
            date: "27 Agu 2026",
            status: "Diproses",
        },
        {
            id: "TKT-7612",
            subject: "Ketidaksesuaian Insentif Sesi Bulan Juli",
            category: "Payroll & Kendala Gaji",
            date: "15 Jul 2026",
            status: "Selesai",
        },
    ]);

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !description) return;

        const newTicket = {
            id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            subject,
            category: category === "teknis" ? "Teknis & Sistem" : category === "payroll" ? "Payroll & Gaji" : "Akun & Keamanan",
            date: "Hari Ini",
            status: "Diproses",
        };

        setTickets([newTicket, ...tickets]);
        setSubject("");
        setDescription("");
        alert("Tiket bantuan Anda berhasil dikirim!");
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            {/* Header Banner & Live Search */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        <LifeBuoy className="w-3.5 h-3.5" /> Pusat Bantuan & Dukungan
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Ada yang bisa kami bantu?
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm">
                        Cari jawaban cepat di dokumen FAQ kami atau kirimkan tiket bantuan ke tim support.
                    </p>

                    {/* Search Input */}
                    <div className="relative pt-2">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
                        <input
                            type="text"
                            placeholder="Cari kata kunci masalah (misal: gaji, presensi, password)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-xs sm:text-sm bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 border-0 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-md placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Grid: FAQ Section & Contact Support */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: FAQ Accordion */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" /> Pertanyaan Sering Diajukan (FAQ)
                    </h2>

                    <div className="space-y-3">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 hover:bg-slate-50/50"
                                        >
                                            <span>{faq.question}</span>
                                            {isOpen ? (
                                                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                            )}
                                        </button>
                                        {isOpen && (
                                            <div className="p-4 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/30 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                                Tidak ada FAQ yang cocok dengan pencarian Anda.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Form Kirim Tiket */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" /> Buat Tiket Bantuan
                    </h2>

                    <form onSubmit={handleCreateTicket} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Masalah</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                            >
                                <option value="teknis">Teknis & Sistem</option>
                                <option value="payroll">Payroll & Gaji</option>
                                <option value="akun">Akun & Profil</option>
                                <option value="lainnya">Pertanyaan Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek Masalah</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ringkasan kendala..."
                                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Rincian Kendala</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Jelaskan kronologi kendala Anda..."
                                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-hidden focus:border-blue-500 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-2xs"
                        >
                            <Send className="w-3.5 h-3.5" /> Kirim Tiket
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Section: Riwayat Tiket Bantuan */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Riwayat Tiket Bantuan Anda
                </h2>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID Tiket</th>
                                    <th className="p-4">Subjek Kendala</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Tanggal Pengajuan</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.map((tkt) => (
                                    <tr key={tkt.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{tkt.id}</td>
                                        <td className="p-4 font-semibold text-slate-800">{tkt.subject}</td>
                                        <td className="p-4">{tkt.category}</td>
                                        <td className="p-4 text-slate-500">{tkt.date}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tkt.status === "Selesai"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {tkt.status === "Selesai" ? (
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                ) : (
                                                    <Clock className="w-3 h-3 text-amber-600" />
                                                )}
                                                {tkt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}