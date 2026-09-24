import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramTypeById } from "@/actions/program-type.action";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ programId: string; productId: string }>;
}) {
    const { programId, productId } = await params;

    // Fetch Data from DB
    const product = await getProgramTypeById(productId);

    if (!product || product.programId !== programId) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans space-y-6">
            <div className="flex justify-between items-center">
                <Link href={`/management/programs/${programId}`} className="text-xs text-blue-600 hover:underline">
                    ← Back to {product.program.name}
                </Link>
                <Link href={`/management/programs/${programId}/products/${productId}/edit`} className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors inline-block">
                    Edit Product
                </Link>
            </div>

            {/* Header Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{product.program.name}</span>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                        <p className="text-xs text-gray-500 mt-1">{product.description || "No description provided."}</p>
                    </div>
                    {product.isActive ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            ACTIVE
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                            INACTIVE
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t text-sm">
                    <div>
                        <p className="text-xs text-gray-400">Delivery Type</p>
                        <p className="font-semibold text-gray-800">{product.deliveryType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Code</p>
                        <p className="font-semibold text-gray-800">{product.code}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Base Price</p>
                        <p className="font-bold text-blue-600">Dynamic Pricing</p> {/* Kept placeholder for future price implementations if needed */}
                    </div>
                </div>
            </div>

            {/* Course Blueprint & Classes Section (Khusus Course) */}
            {product.deliveryType === "COURSE" && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-md font-bold text-gray-800">Master Course Blueprints</h2>
                        <Link href={`/management/programs/${programId}/products/${productId}/courses/create`} className="text-xs text-blue-600 hover:underline font-semibold">
                            + Add Course Blueprint
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {product.courses.length === 0 ? (
                            <p className="text-xs text-gray-500 py-2">Belum ada Master Course untuk product ini.</p>
                        ) : (
                            product.courses.map((course) => (
                                <div key={course.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 p-3 flex justify-between items-center border-b border-slate-200">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{course.name}</span>
                                            <span className="ml-2 text-[10px] font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{course.code}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-slate-500">{course.durationHours} Hours</span>
                                            <Link 
                                                href={`/management/programs/${programId}/products/${productId}/courses/${course.id}/classes/create`}
                                                className="text-xs text-indigo-600 hover:underline font-bold"
                                            >
                                                + Open Class Batch
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white space-y-2">
                                        {!course.classes || course.classes.length === 0 ? (
                                            <p className="text-[11px] text-slate-400">Belum ada batch class yang dibuka untuk course ini.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {course.classes.map(cls => (
                                                    <div key={cls.id} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded text-xs hover:border-slate-300 transition-colors">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-800">{cls.name || "Untitled Class"} <span className="text-slate-500 font-normal">({cls.code})</span></span>
                                                            <span className="text-[10px] text-slate-500">{new Date(cls.startDate).toLocaleDateString()} - {new Date(cls.endDate).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${cls.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                {cls.isActive ? "Active Batch" : "Inactive"}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 mt-1">Capacity: {cls.maxCapacity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Document Requirements */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <h2 className="text-md font-bold text-gray-800 border-b pb-2">Document Requirements</h2>
                <div className="space-y-2">
                    {product.documentRequirements.length === 0 ? (
                        <p className="text-xs text-gray-500 py-2">Tidak ada dokumen yang dipersyaratkan.</p>
                    ) : (
                        product.documentRequirements.map((doc) => (
                            <div key={doc.id} className="flex items-center text-xs text-gray-700 bg-gray-50 p-2.5 rounded border">
                                <span className="text-green-600 font-bold mr-2">✓</span>
                                <span className="font-medium">{doc.name}</span>
                                {doc.isRequired && (
                                    <span className="ml-auto text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                                        Required
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
