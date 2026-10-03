import Link from "next/link";
import { Plus } from "lucide-react";
import { getEnrollments } from "@/actions/enrollment.action";

export default async function EnrollmentsPage() {
    const enrollments = await getEnrollments();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Enrollments</h1>
                    <p className="text-xs text-slate-500">Pendaftaran Layanan (Service) & Kelas (Course)</p>
                </div>
                <Link
                    href="/management/enrollments/create"
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Create Enrollment
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-4">Client</th>
                                <th className="p-4">Service & Program</th>
                                <th className="p-4">Consultant</th>
                                <th className="p-4">Tagihan</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {enrollments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Belum ada data enrollment.
                                    </td>
                                </tr>
                            )}
                            {enrollments.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{inv.clientName}</div>
                                        <div className="text-[10px] text-slate-400">{inv.clientEmail}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{inv.serviceTitle}</div>
                                        <div className="text-[10px] text-slate-500">{inv.programTitle} • {inv.deliveryType}</div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">{inv.consultantName}</td>
                                    <td className="p-4 font-bold text-slate-900">
                                        Rp {inv.totalPayment.toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                            inv.status === 'ACTIVE' || inv.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(inv.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/management/enrollments/${inv.id}`} className="text-blue-600 font-bold hover:underline">
                                            Detail →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}