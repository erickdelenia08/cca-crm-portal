"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProgramType, updateProgramType } from "@/actions/program-type.action";
import { ServiceDeliveryType } from "@prisma/client";
import { ProgramTypeInput } from "@/schemas/program-type.schema";

interface DocReq {
    id: string;
    code: string;
    name: string;
    description: string;
    isRequired: boolean;
}

export function ProgramServiceForm({ 
    programId, 
    programName,
    initialData
}: { 
    programId: string;
    programName: string;
    initialData?: ProgramTypeInput;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const isEdit = !!initialData?.id;

    const [form, setForm] = useState({
        name: initialData?.name || "",
        code: initialData?.code || "",
        description: initialData?.description || "",
        deliveryType: (initialData?.deliveryType as ServiceDeliveryType) || "SERVICE",
        isActive: initialData?.isActive ?? true,
        documentRequirements: initialData?.documentRequirements?.length ? initialData.documentRequirements.map((d, idx) => ({
            id: d.id || `doc-${crypto.randomUUID()}`,
            code: d.code,
            name: d.name,
            description: d.description || "",
            isRequired: d.isRequired ?? true
        })) : [
            { id: "1", code: "STUDENT_ID", name: "Student ID", description: "Kartu Pelajar / KTP", isRequired: true },
        ] as DocReq[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddDoc = () => {
        setForm((prev) => ({
            ...prev,
            documentRequirements: [
                ...prev.documentRequirements,
                { id: Date.now().toString(), code: "", name: "", description: "", isRequired: true },
            ],
        }));
    };

    const handleRemoveDoc = (id: string) => {
        setForm((prev) => ({
            ...prev,
            documentRequirements: prev.documentRequirements.filter((d) => d.id !== id),
        }));
    };

    const handleDocChange = (id: string, field: keyof DocReq, value: unknown) => {
        setForm((prev) => ({
            ...prev,
            documentRequirements: prev.documentRequirements.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            try {
                const payload = {
                    name: form.name,
                    code: form.code,
                    description: form.description || undefined,
                    programId: programId,
                    isActive: form.isActive,
                    deliveryType: form.deliveryType,
                    documentRequirements: form.documentRequirements.map(d => ({
                        code: d.code,
                        name: d.name,
                        description: d.description || undefined,
                        isRequired: d.isRequired
                    }))
                };

                if (isEdit && initialData.id) {
                    await updateProgramType(initialData.id, payload);
                } else {
                    await createProgramType(payload);
                }

                setMessage({ type: "success", text: `Product/Service berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!` });
                setTimeout(() => {
                    router.push(isEdit ? `/management/programs/${programId}/products/${initialData.id}` : `/management/programs/${programId}`);
                    router.refresh();
                }, 1000);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setMessage({ type: "error", text: errorMessage });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 text-sm rounded-md border ${message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Business Line / Program</label>
                    <input
                        type="text"
                        disabled
                        value={programName}
                        className="w-full border border-gray-200 bg-gray-100 text-gray-600 font-bold rounded p-2 text-sm cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. English Course"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Service Code *</label>
                        <input
                            type="text"
                            name="code"
                            placeholder="e.g. ENGLISH_COURSE"
                            value={form.code}
                            onChange={(e) => handleChange({ ...e, target: { ...e.target, name: "code", value: e.target.value.toUpperCase() } })}
                            required
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={2}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                    <select
                        name="isActive"
                        value={form.isActive.toString()}
                        onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Delivery Type */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-semibold text-gray-800 border-b pb-2">Delivery Type</h2>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`p-4 border rounded-lg cursor-pointer flex items-center ${form.deliveryType === "SERVICE" ? "border-blue-600 bg-blue-50/50" : ""}`}>
                        <input
                            type="radio"
                            name="deliveryType"
                            checked={form.deliveryType === "SERVICE"}
                            onChange={() => setForm((p) => ({ ...p, deliveryType: "SERVICE" }))}
                            className="mr-2"
                        />
                        <span className="text-sm font-medium">Service (Non-Kelas)</span>
                    </label>

                    <label className={`p-4 border rounded-lg cursor-pointer flex items-center ${form.deliveryType === "COURSE" ? "border-blue-600 bg-blue-50/50" : ""}`}>
                        <input
                            type="radio"
                            name="deliveryType"
                            checked={form.deliveryType === "COURSE"}
                            onChange={() => setForm((p) => ({ ...p, deliveryType: "COURSE" }))}
                            className="mr-2"
                        />
                        <span className="text-sm font-medium">Course (Berkelas)</span>
                    </label>
                </div>
            </div>

            {/* Document Requirements */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-md font-semibold text-gray-800">Document Requirements</h2>
                    <button type="button" onClick={handleAddDoc} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded font-semibold border">+ Add Requirement</button>
                </div>
                {form.documentRequirements.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded">
                        <input type="text" placeholder="Name" value={doc.name} onChange={(e) => handleDocChange(doc.id, "name", e.target.value)} className="col-span-4 border rounded p-1 text-xs bg-white" required />
                        <input type="text" placeholder="Code" value={doc.code} onChange={(e) => handleDocChange(doc.id, "code", e.target.value.toUpperCase())} className="col-span-3 border rounded p-1 text-xs bg-white" required />
                        <input type="text" placeholder="Desc" value={doc.description} onChange={(e) => handleDocChange(doc.id, "description", e.target.value)} className="col-span-3 border rounded p-1 text-xs bg-white" />
                        <label className="col-span-1 text-[10px] flex items-center"><input type="checkbox" checked={doc.isRequired} onChange={(e) => handleDocChange(doc.id, "isRequired", e.target.checked)} className="mr-1" /> Req</label>
                        <button type="button" onClick={() => handleRemoveDoc(doc.id)} className="col-span-1 text-red-500 text-xs font-bold text-right cursor-pointer hover:underline">✕</button>
                    </div>
                ))}
                {form.documentRequirements.length === 0 && (
                    <div className="text-center text-xs text-gray-500 py-4">Belum ada dokumen yang dipersyaratkan.</div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Link href={`/management/programs/${programId}`} className="px-4 py-2 border rounded text-xs font-medium text-gray-600 bg-white hover:bg-gray-50">Cancel</Link>
                <button type="submit" disabled={isPending} className="px-5 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer">
                    {isPending ? "Saving..." : "Create Product"}
                </button>
            </div>
        </form>
    );
}
