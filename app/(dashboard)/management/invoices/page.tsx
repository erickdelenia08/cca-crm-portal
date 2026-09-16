import React from "react";
import { getInvoices } from "@/actions/invoice.action";
import { InvoiceTable } from "@/components/tables/invoice-table";
import { redirect } from "next/navigation";

export default async function ManagementInvoicesPage() {
    const res = await getInvoices();

    if (!res.success) {
        if (res.error === "UNAUTHORIZED") {
            redirect("/login");
        }
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    Error memuat data invoice: {res.error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
            <InvoiceTable invoices={res.data || []} />
        </div>
    );
}