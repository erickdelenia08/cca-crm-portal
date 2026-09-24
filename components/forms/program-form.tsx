"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProgram } from "@/actions/program.action";

export function ProgramForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        isActive: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value === "true" ? true : value === "false" ? false : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            try {
                await createProgram(form);
                setMessage({ type: "success", text: "Program / Business Line berhasil dibuat!" });
                setTimeout(() => {
                    router.push("/management/programs");
                }, 1000);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setMessage({ type: "error", text: errorMessage });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className={`mb-4 p-3 border text-sm rounded ${message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Program Name *</label>
                <input
                    type="text"
                    name="name"
                    placeholder="e.g. CCACADEMY"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Program Code *</label>
                <input
                    type="text"
                    name="code"
                    placeholder="e.g. CCACADEMY"
                    value={form.code}
                    onChange={(e) =>
                        handleChange({
                            ...e,
                            target: { ...e.target, name: "code", value: e.target.value.toUpperCase() },
                        })
                    }
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    placeholder="Deskripsi singkat seputar bisnis unit ini..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                    name="isActive"
                    value={form.isActive.toString()}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Link
                    href="/management/programs"
                    className="px-4 py-2 border rounded text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "Creating..." : "Create Program"}
                </button>
            </div>
        </form>
    );
}
