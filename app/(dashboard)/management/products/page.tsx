"use client";

import Link from "next/link";
import { useState } from "react";

const ALL_PRODUCTS = [
    { id: "study-overseas", program: "CCABROAD", name: "Study Overseas", type: "SERVICE" },
    { id: "visitor-visa", program: "CCABROAD", name: "Visitor Visa", type: "SERVICE" },
    { id: "study-tour", program: "CCACADEMY", name: "Study Tour", type: "SERVICE" },
    { id: "english-course", program: "CCACADEMY", name: "English Course", type: "COURSE" },
    { id: "mandarin-course", program: "CCACADEMY", name: "Mandarin Course", type: "COURSE" },
    { id: "finance-protection", program: "CCADVISORY", name: "Finance & Protection", type: "SERVICE" },
];

export default function AllProductsPage() {
    const [search, setSearch] = useState("");

    const filteredProducts = ALL_PRODUCTS.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.program.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 font-sans">
            <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Products / Services</h1>
                    <p className="text-sm text-gray-500">Daftar semua produk dan layanan dari seluruh Business Line.</p>
                </div>
                <input
                    type="text"
                    placeholder="Search product or program..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                            <th className="py-3 px-4">Program</th>
                            <th className="py-3 px-4">Product Name</th>
                            <th className="py-3 px-4">Delivery Type</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredProducts.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-bold text-gray-700">{prod.program}</td>
                                <td className="py-3 px-4 font-medium text-gray-900">{prod.name}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${prod.type === "COURSE" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {prod.type}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Link
                                        href={`/management/products/${prod.id}`}
                                        className="text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}