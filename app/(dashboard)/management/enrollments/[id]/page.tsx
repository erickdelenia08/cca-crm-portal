import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnrollmentById } from "@/actions/enrollment.action";

export default async function EnrollmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const enrollment = await getEnrollmentById(id);
    if (!enrollment) return notFound();

    const isCourse = enrollment.programType.deliveryType === "COURSE";
    const courseEnrollment = isCourse && enrollment.courseEnrollments.length > 0 
        ? enrollment.courseEnrollments[0] 
        : null;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 font-sans space-y-6">
            <div className="flex justify-between items-center">
                <Link href="/management/enrollments" className="text-xs text-blue-600 hover:underline">
                    ← Back to Enrollments
                </Link>
                <div className="flex items-center gap-3">
                    <Link href={`/management/enrollments/${id}/edit`} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded font-bold text-xs hover:bg-slate-50 transition-colors">
                        Edit
                    </Link>
                    <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-bold text-xs uppercase">
                        Status: {enrollment.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Client Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold">Name</p>
                                <p className="font-medium">{enrollment.client.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold">Email</p>
                                <p className="font-medium">{enrollment.client.email}</p>
                            </div>
                            {!isCourse && (
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold">Consultant</p>
                                    <p className="font-medium">{enrollment.consultant?.name || "None"}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-gray-500 text-xs font-semibold">Enrolled At</p>
                                <p className="font-medium">{new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Service Information</h2>
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold">Program / Brand</p>
                                    <p className="font-medium uppercase">{enrollment.programType.program.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold">Service</p>
                                    <p className="font-bold text-blue-700">{enrollment.programType.name}</p>
                                </div>
                            </div>
                            
                            {isCourse && courseEnrollment ? (
                                <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-100">
                                    <h3 className="font-bold text-purple-800 mb-2 text-xs uppercase">Class details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-purple-600 text-xs font-semibold">Course</p>
                                            <p className="font-medium">{courseEnrollment.courseClass.course.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-600 text-xs font-semibold">Class Batch</p>
                                            <p className="font-medium">{courseEnrollment.courseClass.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-600 text-xs font-semibold">Teacher</p>
                                            <p className="font-medium">{courseEnrollment.courseClass.teacher?.user?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <p className="text-gray-500 text-xs font-semibold">Additional Details</p>
                                    <pre className="bg-gray-50 p-3 rounded border text-xs mt-1 overflow-x-auto">
                                        {JSON.stringify(enrollment.extendedData || {}, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Billing & Invoices</h2>
                        {enrollment.invoices.length === 0 ? (
                            <p className="text-xs text-gray-500">No invoices attached.</p>
                        ) : (
                            <div className="space-y-4">
                                {enrollment.invoices.map(inv => (
                                    <div key={inv.id} className="border p-4 rounded bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold font-mono text-sm">{inv.invoiceNumber}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">{inv.status}</span>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <p><strong>Subtotal:</strong> Rp {Number(inv.subtotal).toLocaleString('id-ID')}</p>
                                            <p><strong>Discount:</strong> Rp {Number(inv.discountAmount).toLocaleString('id-ID')}</p>
                                            <p className="text-lg font-bold text-blue-700 mt-2"><strong>Total:</strong> Rp {Number(inv.totalAmount).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Documents Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">Document Requirements</h2>
                        <div className="space-y-3">
                            {enrollment.documentRequirements.length === 0 ? (
                                <p className="text-xs text-gray-500">Tidak ada dokumen yang dipersyaratkan.</p>
                            ) : (
                                enrollment.documentRequirements.map(req => {
                                    const doc = req.documents[0]; // Active doc
                                    return (
                                        <div key={req.id} className="p-3 border rounded text-xs">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold">{req.name}</span>
                                                {req.isRequired && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">REQ</span>}
                                            </div>
                                            {doc ? (
                                                <div className="text-[10px] font-bold text-green-600 mt-1">
                                                    Status: {doc.status}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-bold text-gray-400 mt-1">
                                                    Belum di-upload
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
