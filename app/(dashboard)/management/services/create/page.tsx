"use client";

import React, { useState, useTransition } from "react";

// ============================================================
// 1. TYPES & MOCK DATA
// ============================================================

type DeliveryType = "SERVICE" | "COURSE";

interface DocumentRequirementInput {
    id: string;
    code: string;
    name: string;
    description: string;
    isRequired: boolean;
}

interface FormState {
    programId: string;
    name: string;
    code: string;
    description: string;
    deliveryType: DeliveryType;
    // Course Config (hanya diisi jika deliveryType === 'COURSE')
    courseCategory: string;
    courseLevel: string;
    totalSessions: number;
    durationHours: number;
    basePrice: number;
    // Documents
    documentRequirements: DocumentRequirementInput[];
}

const MOCK_PROGRAMS = [
    { id: "prog-1", name: "CCABROAD", code: "CCABROAD" },
    { id: "prog-2", name: "CCACADEMY", code: "CCACADEMY" },
    { id: "prog-3", name: "CCADVISORY", code: "CCADVISORY" },
];

// ============================================================
// 2. MOCK SERVER ACTION
// ============================================================

async function mockCreateServiceAction(formData: FormState) {
    // Simulasi API / Prisma Transaction
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("=== DATA YANG DIKIRIM KE DATABASE ===", JSON.stringify(formData, null, 2));
    return { success: true, message: "Service / Product berhasil dibuat!" };
}

// ============================================================
// 3. MAIN COMPONENT (PAGE)
// ============================================================

export default function CreateServicePage() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    // Form State
    const [form, setForm] = useState<FormState>({
        programId: "prog-1",
        name: "",
        code: "",
        description: "",
        deliveryType: "SERVICE",
        courseCategory: "LANGUAGE",
        courseLevel: "BASIC",
        totalSessions: 12,
        durationHours: 24,
        basePrice: 1500000,
        documentRequirements: [
            { id: "1", code: "PASSPORT", name: "Passport", description: "Valid passport", isRequired: true },
            { id: "2", code: "KTP", name: "KTP", description: "Indonesian ID", isRequired: true },
        ],
    });

    // Handler input biasa
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handler Document Requirements (Dynamic List)
    const handleAddDocument = () => {
        const newDoc: DocumentRequirementInput = {
            id: Date.now().toString(),
            code: "",
            name: "",
            description: "",
            isRequired: true,
        };
        setForm((prev) => ({
            ...prev,
            documentRequirements: [...prev.documentRequirements, newDoc],
        }));
    };

    const handleRemoveDocument = (id: string) => {
        setForm((prev) => ({
            ...prev,
            documentRequirements: prev.documentRequirements.filter((doc) => doc.id !== id),
        }));
    };

    const handleDocChange = (id: string, field: keyof DocumentRequirementInput, value: any) => {
        setForm((prev) => ({
            ...prev,
            documentRequirements: prev.documentRequirements.map((doc) => {
                if (doc.id === id) {
                    return { ...doc, [field]: value };
                }
                return doc;
            }),
        }));
    };

    // Submit Handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const res = await mockCreateServiceAction(form);
            if (res.success) {
                setMessage(res.message);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create Service / Product</h1>
                    <p className="text-sm text-gray-600">
                        Tambahkan layanan atau produk baru ke dalam Business Line.
                    </p>
                </div>

                {/* Alert Sukses */}
                {message && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
                        <span>{message}</span>
                        <button onClick={() => setMessage(null)} className="font-bold text-green-700">✕</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ============================================================ */}
                    {/* 1. BASIC INFORMATION                                        */}
                    {/* ============================================================ */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Line / Program *
                            </label>
                            <select
                                name="programId"
                                value={form.programId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {MOCK_PROGRAMS.map((prog) => (
                                    <option key={prog.id} value={prog.id}>
                                        {prog.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Visitor Visa / English Course"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Code *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="e.g. VISITOR_VISA"
                                    value={form.code}
                                    onChange={(e) =>
                                        handleChange({
                                            ...e,
                                            target: { ...e.target, name: "code", value: e.target.value.toUpperCase() },
                                        })
                                    }
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Penjelasan singkat mengenai produk/layanan ini..."
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* 2. DELIVERY TYPE SELECTION                                   */}
                    {/* ============================================================ */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Delivery Type</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${form.deliveryType === "SERVICE"
                                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    value="SERVICE"
                                    checked={form.deliveryType === "SERVICE"}
                                    onChange={() => setForm((p) => ({ ...p, deliveryType: "SERVICE" }))}
                                    className="mt-1 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="ml-3">
                                    <span className="block font-medium text-sm text-gray-900">Service</span>
                                    <span className="block text-xs text-gray-500">
                                        Jasa konsultasi, pemrosesan visa, pengurusan dokumen, atau asistensi.
                                    </span>
                                </div>
                            </label>

                            <label
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${form.deliveryType === "COURSE"
                                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    value="COURSE"
                                    checked={form.deliveryType === "COURSE"}
                                    onChange={() => setForm((p) => ({ ...p, deliveryType: "COURSE" }))}
                                    className="mt-1 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="ml-3">
                                    <span className="block font-medium text-sm text-gray-900">Course</span>
                                    <span className="block text-xs text-gray-500">
                                        Program pelatihan, kelas pembelajaran, kursus bahasa, atau akademik.
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* 3. CONDITIONAL COURSE CONFIGURATION (HANYA MUNCUL JIKA COURSE)*/}
                    {/* ============================================================ */}
                    {form.deliveryType === "COURSE" && (
                        <div className="bg-amber-50/30 p-6 rounded-lg border border-amber-200 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold text-amber-900 border-b border-amber-200 pb-2">
                                3. Course Configuration
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="courseCategory"
                                        value={form.courseCategory}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="LANGUAGE">Language</option>
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="SKILL">Skill</option>
                                        <option value="ORIENTATION">Orientation</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Level
                                    </label>
                                    <select
                                        name="courseLevel"
                                        value={form.courseLevel}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="BASIC">Basic</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                        <option value="PREPARATION">Preparation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Sessions
                                    </label>
                                    <input
                                        type="number"
                                        name="totalSessions"
                                        value={form.totalSessions}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (Hours)
                                    </label>
                                    <input
                                        type="number"
                                        name="durationHours"
                                        value={form.durationHours}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Base Price (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={form.basePrice}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============================================================ */}
                    {/* 4. DOCUMENT REQUIREMENTS                                     */}
                    {/* ============================================================ */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {form.deliveryType === "COURSE" ? "4. Document Requirements" : "3. Document Requirements"}
                                </h2>
                                <p className="text-xs text-gray-500">Daftar dokumen wajib/opsional yang harus diisi client.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddDocument}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md transition-all border border-gray-300"
                            >
                                + Add Requirement
                            </button>
                        </div>

                        {form.documentRequirements.length === 0 ? (
                            <p className="text-sm text-center py-4 text-gray-400 italic">
                                Tidak ada dokumen yang disyaratkan.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {form.documentRequirements.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-md grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                                    >
                                        <div className="sm:col-span-3">
                                            <input
                                                type="text"
                                                placeholder="Document Name (e.g. KTP)"
                                                value={doc.name}
                                                onChange={(e) => handleDocChange(doc.id, "name", e.target.value)}
                                                required
                                                className="w-full border border-gray-300 rounded p-1.5 text-xs focus:outline-none bg-white"
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <input
                                                type="text"
                                                placeholder="Code (e.g. KTP_ID)"
                                                value={doc.code}
                                                onChange={(e) => handleDocChange(doc.id, "code", e.target.value.toUpperCase())}
                                                required
                                                className="w-full border border-gray-300 rounded p-1.5 text-xs focus:outline-none bg-white"
                                            />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <input
                                                type="text"
                                                placeholder="Description / Instructions"
                                                value={doc.description}
                                                onChange={(e) => handleDocChange(doc.id, "description", e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1.5 text-xs focus:outline-none bg-white"
                                            />
                                        </div>

                                        <div className="sm:col-span-1 flex items-center">
                                            <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={doc.isRequired}
                                                    onChange={(e) => handleDocChange(doc.id, "isRequired", e.target.checked)}
                                                    className="mr-1 rounded text-blue-600"
                                                />
                                                Req?
                                            </label>
                                        </div>

                                        <div className="sm:col-span-1 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700 text-xs font-bold p-1"
                                                title="Delete"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ============================================================ */}
                    {/* SUBMIT BUTTON                                                */}
                    {/* ============================================================ */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Create Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}