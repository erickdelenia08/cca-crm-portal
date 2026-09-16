import React from "react";
import { getStudentsForInvoice } from "@/actions/invoice.action";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { redirect } from "next/navigation";

export default async function InvoiceCreatePage() {
    const res = await getStudentsForInvoice();

    if (!res.success) {
        if (res.error === "UNAUTHORIZED") {
            redirect("/login");
        }
        return (
            <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen space-y-6">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    Error memuat data siswa: {res.error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen space-y-6">
            <InvoiceForm students={res.data || []} />
        </div>
    );
}