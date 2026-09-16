"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Printer, Save, AlertTriangle, UserCheck } from "lucide-react";
import { invoiceSchema, InvoiceInput } from "@/schemas/invoice.schema";
import { createInvoice } from "@/actions/invoice.action";
import { useRouter } from "next/navigation";

export function InvoiceForm({
    students,
}: {
    students: { id: string; fullName: string; email: string | null; studentNumber: string | null }[];
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<InvoiceInput>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            rate: "-",
            studentId: "",
            items: [{ description: "", qty: 1, discount: 0, unitPrice: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const selectedStudentId = watch("studentId");
    const items = watch("items");

    const selectedStudent = students.find((s) => s.id === selectedStudentId);

    const calculateItemAmount = (qty: number, unitPrice: number, discount: number) => {
        const total = qty * unitPrice - discount;
        return total > 0 ? total : 0;
    };

    const subtotal = items?.reduce((acc, item) => acc + calculateItemAmount(item.qty, item.unitPrice, item.discount), 0) || 0;

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const onSubmit = async (data: InvoiceInput) => {
        setIsSubmitting(true);
        setError(null);

        const res = await createInvoice(data);
        if (res.success) {
            router.push("/management/invoices");
        } else {
            setError(res.error || "Terjadi kesalahan");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            {/* Top Bar Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Form Tagihan Invoice</h1>
                    <p className="text-xs text-slate-500">Standard Dokumen PT Dua Permata Nusantara</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:bg-slate-50 font-medium disabled:opacity-50">
                        <Printer className="w-4 h-4" /> Preview / Print PDF
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm text-white hover:bg-indigo-700 font-medium disabled:opacity-50">
                        <Save className="w-4 h-4" /> {isSubmitting ? "Menyimpan..." : "Simpan & Generate"}
                    </button>
                </div>
            </div>

            {/* Main Invoice Form / Sheet */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">

                {/* Header Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-6">
                    {/* Sisi Kiri: Detail Invoice */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 items-center text-sm">
                            <span className="font-semibold text-slate-700">INVOICE :</span>
                            <span className="col-span-2 font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                                [AUTO-GENERATED]
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">Date :</label>
                            <div className="col-span-2">
                                <input
                                    type="date"
                                    {...register("date")}
                                    className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">Due Date :</label>
                            <div className="col-span-2">
                                <input
                                    type="date"
                                    {...register("dueDate")}
                                    className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">Rate :</label>
                            <div className="col-span-2">
                                <input
                                    type="text"
                                    placeholder="misal: 15,000 / -"
                                    {...register("rate")}
                                    className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Client Info dengan Autocomplete Select */}
                    <div className="space-y-3 bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
                        {/* Selector Client */}
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-700 font-medium flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Pilih Client :
                            </label>
                            <div className="col-span-2">
                                <select
                                    {...register("studentId")}
                                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 outline-none"
                                >
                                    <option value="">-- Pilih Client / Siswa --</option>
                                    {students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.fullName} ({student.studentNumber || "N/A"})
                                        </option>
                                    ))}
                                </select>
                                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
                            </div>
                        </div>

                        {/* Input Name (Auto-Filled & Locked) */}
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">Name :</label>
                            <input
                                type="text"
                                readOnly
                                placeholder="Pilih client terlebih dahulu"
                                value={selectedStudent?.fullName || ""}
                                className="col-span-2 border border-slate-200 bg-slate-100/80 text-slate-700 font-medium rounded px-2 py-1 text-sm cursor-not-allowed outline-none select-none"
                            />
                        </div>

                        {/* Input Email (Auto-Filled & Locked) */}
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">Email :</label>
                            <input
                                type="email"
                                readOnly
                                placeholder="Pilih client terlebih dahulu"
                                value={selectedStudent?.email || ""}
                                className="col-span-2 border border-slate-200 bg-slate-100/80 text-slate-700 font-medium rounded px-2 py-1 text-sm cursor-not-allowed outline-none select-none"
                            />
                        </div>

                        {/* Input ID (Auto-Filled & Locked) */}
                        <div className="grid grid-cols-3 items-center text-sm">
                            <label className="text-slate-600">ID :</label>
                            <input
                                type="text"
                                readOnly
                                placeholder="Pilih client terlebih dahulu"
                                value={selectedStudent?.studentNumber || ""}
                                className="col-span-2 border border-slate-200 bg-slate-100/80 text-indigo-700 font-mono font-bold rounded px-2 py-1 text-sm cursor-not-allowed outline-none select-none"
                            />
                        </div>
                    </div>
                </div>

                {errors.items && !Array.isArray(errors.items) && (
                    <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>
                )}

                {/* Dynamic Table Input */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-900 text-white font-medium text-xs">
                                <th className="py-2.5 px-3 border border-blue-900 w-1/2">Description</th>
                                <th className="py-2.5 px-3 border border-blue-900 text-center w-16">Qty.</th>
                                <th className="py-2.5 px-3 border border-blue-900 text-right w-28">Disc. (Rp)</th>
                                <th className="py-2.5 px-3 border border-blue-900 text-right w-36">Unit Price</th>
                                <th className="py-2.5 px-3 border border-blue-900 text-right w-36">Amount</th>
                                <th className="py-2.5 px-2 border border-blue-900 w-10 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {fields.map((field, index) => {
                                const currentItem = items?.[index] || { qty: 0, unitPrice: 0, discount: 0 };
                                const amount = calculateItemAmount(currentItem.qty, currentItem.unitPrice, currentItem.discount);

                                return (
                                    <tr key={field.id} className="hover:bg-slate-50">
                                        <td className="p-1.5 border border-slate-300 align-top">
                                            <input
                                                type="text"
                                                placeholder="Input deskripsi layanan..."
                                                {...register(`items.${index}.description`)}
                                                className="w-full p-1 bg-transparent outline-none"
                                            />
                                            {errors.items?.[index]?.description && (
                                                <p className="text-red-500 text-xs mt-1 px-1">{errors.items[index].description.message}</p>
                                            )}
                                        </td>
                                        <td className="p-1.5 border border-slate-300 align-top">
                                            <input
                                                type="number"
                                                min="1"
                                                {...register(`items.${index}.qty`)}
                                                className="w-full text-center p-1 bg-transparent outline-none"
                                            />
                                            {errors.items?.[index]?.qty && (
                                                <p className="text-red-500 text-xs mt-1 px-1">{errors.items[index].qty.message}</p>
                                            )}
                                        </td>
                                        <td className="p-1.5 border border-slate-300 align-top">
                                            <input
                                                type="number"
                                                min="0"
                                                {...register(`items.${index}.discount`)}
                                                className="w-full text-right p-1 bg-transparent outline-none"
                                            />
                                            {errors.items?.[index]?.discount && (
                                                <p className="text-red-500 text-xs mt-1 px-1">{errors.items[index].discount.message}</p>
                                            )}
                                        </td>
                                        <td className="p-1.5 border border-slate-300 align-top">
                                            <input
                                                type="number"
                                                min="0"
                                                {...register(`items.${index}.unitPrice`)}
                                                className="w-full text-right p-1 bg-transparent outline-none"
                                            />
                                            {errors.items?.[index]?.unitPrice && (
                                                <p className="text-red-500 text-xs mt-1 px-1">{errors.items[index].unitPrice.message}</p>
                                            )}
                                        </td>
                                        <td className="p-2 border border-slate-300 text-right font-medium text-slate-800 bg-slate-50/50 align-top">
                                            {formatRupiah(amount)}
                                        </td>
                                        <td className="p-1 border border-slate-300 text-center align-top pt-2">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-rose-500 hover:text-rose-700 disabled:opacity-20 inline-block"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={() => append({ description: "", qty: 1, discount: 0, unitPrice: 0 })}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    <Plus className="w-4 h-4" /> Tambah Baris Layanan
                </button>

                {/* Subtotal Calculation Result */}
                <div className="flex justify-end pt-2">
                    <div className="w-72 border border-slate-300 rounded overflow-hidden">
                        <div className="flex justify-between items-center bg-slate-100 p-2.5 text-sm font-bold text-slate-900">
                            <span>Subtotal :</span>
                            <span className="font-mono text-base">{formatRupiah(subtotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notice Standard Document */}
                <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-lg space-y-1 text-xs text-amber-900 mt-6">
                    <div className="flex items-center gap-1 font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4" /> WARNING !
                    </div>
                    <p>Harap berhati-hati terhadap segala bentuk penipuan yang mengatasnamakan <strong>PT Dua Permata Nusantara</strong>.</p>
                    <p>Seluruh pembayaran hanya boleh dilakukan ke rekening bank yang secara resmi terdaftar atas nama PT Dua Permata Nusantara.</p>
                </div>

            </div>
        </form>
    );
}
