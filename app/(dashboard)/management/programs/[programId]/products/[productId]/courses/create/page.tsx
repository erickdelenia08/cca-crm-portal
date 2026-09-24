import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramTypeById } from "@/actions/program-type.action";
import { CourseFormWrapper } from "@/components/forms/course-form-wrapper";

export default async function CreateCoursePage({
    params,
}: {
    params: Promise<{ programId: string; productId: string }>;
}) {
    const { programId, productId } = await params;
    
    // Validate that the product exists and belongs to the given program
    const product = await getProgramTypeById(productId);
    if (!product || product.programId !== programId || product.deliveryType !== "COURSE") {
        return notFound();
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 font-sans space-y-6">
            <div>
                <Link href={`/management/programs/${programId}/products/${productId}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to {product.name}
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Class</h1>
                <p className="text-xs text-gray-500">
                    Menambahkan kelas (Course) baru ke dalam layanan <strong className="uppercase text-gray-800">{product.name}</strong>.
                </p>
            </div>

            <CourseFormWrapper programId={programId} productId={productId} />
        </div>
    );
}
