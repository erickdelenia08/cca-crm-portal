import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramTypeById } from "@/actions/program-type.action";
import { ProgramServiceForm } from "@/components/forms/program-service-form";

export default async function EditProductUnderProgramPage({
    params,
}: {
    params: Promise<{ programId: string; productId: string }>;
}) {
    const { programId, productId } = await params;
    
    // Fetch the product
    const product = await getProgramTypeById(productId);
    
    if (!product || product.programId !== programId) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Link href={`/management/programs/${programId}/products/${productId}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to {product.name}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Product / Service</h1>
                    <p className="text-xs text-gray-500">
                        Memperbarui produk <strong className="uppercase text-gray-800">{product.name}</strong> di Business Line: <strong className="uppercase text-gray-800">{product.program.name}</strong>
                    </p>
                </div>

                <ProgramServiceForm 
                    programId={programId} 
                    programName={product.program.name} 
                    initialData={{
                        id: product.id,
                        programId: product.programId,
                        name: product.name,
                        code: product.code,
                        description: product.description,
                        deliveryType: product.deliveryType,
                        isActive: product.isActive,
                        documentRequirements: product.documentRequirements.map(req => ({
                            id: req.id,
                            name: req.name,
                            code: req.code,
                            description: req.description,
                            isRequired: req.isRequired,
                        }))
                    }} 
                />
            </div>
        </div>
    );
}
