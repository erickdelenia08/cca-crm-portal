'use client';

import { useState } from 'react';
import { Plus, X, Upload, CheckCircle2 } from 'lucide-react';

// DUMMY MASTER DATA DATABASE
const MASTER_STUDENTS = [
    { id: 'std_1', name: 'Budi Santoso', email: 'budi@gmail.com' },
    { id: 'std_2', name: 'Siti Rahma', email: 'siti@gmail.com' },
    { id: 'std_3', name: 'Ahmad Rizky', email: 'ahmad@gmail.com' },
];

const MASTER_TARGET_OFFERINGS = [
    {
        id: 'off_1',
        name: 'IELTS Intensive Prep - Kelas A (Pagi)',
        price: 2500000,
        requiredDocs: ['KTP / Kartu Pelajar', 'Pas Foto 3x4']
    },
    {
        id: 'off_2',
        name: 'Visitor Visa Australia (Pengurusan Non-Kelas)',
        price: 4500000,
        requiredDocs: ['Paspor Asli', 'Rekening Koran 3 Bulan', 'KTP / KK', 'Surat Sponsor']
    },
];

interface InvoiceData {
    id: string;
    invoiceNumber: string;
    studentName: string;
    targetOffering: string;
    amount: number;
    status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID';
    uploadedDocsCount: number;
    requiredDocsCount: number;
}

export default function EnrollmentsPage() {
    const [invoices, setInvoices] = useState<InvoiceData[]>([
        {
            id: 'inv_1',
            invoiceNumber: 'INV-2026-001',
            studentName: 'Budi Santoso',
            targetOffering: 'IELTS Intensive Prep - Kelas A (Pagi)',
            amount: 2500000,
            status: 'PAID',
            uploadedDocsCount: 2,
            requiredDocsCount: 2,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOfferingId, setSelectedOfferingId] = useState(MASTER_TARGET_OFFERINGS[0].id);
    const [selectedStudentId, setSelectedStudentId] = useState(MASTER_STUDENTS[0].id);

    // Dynamic State Upload Dokumen berdasarkan Offering
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: boolean }>({});

    const currentOffering = MASTER_TARGET_OFFERINGS.find(o => o.id === selectedOfferingId)!;

    const handleToggleDocUpload = (docName: string) => {
        setUploadedFiles(prev => ({
            ...prev,
            [docName]: !prev[docName]
        }));
    };

    const handleCreateEnrollment = (e: React.FormEvent) => {
        e.preventDefault();
        const student = MASTER_STUDENTS.find(s => s.id === selectedStudentId)!;

        const countUploaded = Object.values(uploadedFiles).filter(Boolean).length;

        const newInvoice: InvoiceData = {
            id: `inv_${Date.now()}`,
            invoiceNumber: `INV-2026-00${invoices.length + 1}`,
            studentName: student.name,
            targetOffering: currentOffering.name,
            amount: currentOffering.price,
            status: 'ISSUED',
            uploadedDocsCount: countUploaded,
            requiredDocsCount: currentOffering.requiredDocs.length
        };

        setInvoices([...invoices, newInvoice]);
        setIsModalOpen(false);
        setUploadedFiles({});
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pendaftaran & Transaksi</h1>
                    <p className="text-xs text-slate-500">Pendaftaran Layanan/Kelas dengan Verifikasi Dokumen Persyaratan</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                >
                    <Plus className="w-4 h-4" /> Daftarkan Murid / Klien
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="p-3">No. Invoice & Student</th>
                            <th className="p-3">Program / Rombel</th>
                            <th className="p-3">Kelengkapan Dokumen Syarat</th>
                            <th className="p-3">Total Tagihan</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50">
                                <td className="p-3">
                                    <div className="font-bold text-slate-900">{inv.studentName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{inv.invoiceNumber}</div>
                                </td>
                                <td className="p-3 font-medium text-slate-700">{inv.targetOffering}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.uploadedDocsCount === inv.requiredDocsCount ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {inv.uploadedDocsCount} / {inv.requiredDocsCount} Dokumen Ter-upload
                                    </span>
                                </td>
                                <td className="p-3 font-bold text-slate-900">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Pendaftaran */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Form Pendaftaran Baru</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleCreateEnrollment} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-600">Pilih Murid (Dari Master User)</label>
                                <select
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    className="w-full border rounded-lg p-2 text-xs font-bold text-slate-800 mt-1"
                                >
                                    {MASTER_STUDENTS.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-600">Pilih Program / Rombel Target</label>
                                <select
                                    value={selectedOfferingId}
                                    onChange={(e) => {
                                        setSelectedOfferingId(e.target.value);
                                        setUploadedFiles({});
                                    }}
                                    className="w-full border rounded-lg p-2 text-xs font-bold text-slate-800 mt-1"
                                >
                                    {MASTER_TARGET_OFFERINGS.map((o) => (
                                        <option key={o.id} value={o.id}>{o.name} - Rp {o.price.toLocaleString('id-ID')}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dynamic Document Upload Requirements Checklist */}
                            <div className="border-t pt-3">
                                <label className="text-[11px] font-bold text-slate-700 block mb-2">
                                    Dokumen Persyaratan Khusus ({currentOffering.requiredDocs.length} Dokumen Wajib)
                                </label>
                                <div className="space-y-2">
                                    {currentOffering.requiredDocs.map((doc, idx) => {
                                        const isUploaded = !!uploadedFiles[doc];
                                        return (
                                            <div key={idx} className="flex items-center justify-between p-2.5 border rounded-lg bg-slate-50">
                                                <span className="text-xs text-slate-700 font-medium">• {doc}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleDocUpload(doc)}
                                                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${isUploaded ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {isUploaded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                                                    {isUploaded ? 'Ter-upload' : 'Simulasi Upload'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500">Batal</button>
                                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">Proses Pendaftaran</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}