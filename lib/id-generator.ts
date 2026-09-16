// src/lib/id-generator.ts
import { prisma } from "@/lib/prisma";

// Generator ID Kustom untuk Student/Klien
export async function generateStudentId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.studentProfile.count();
    const sequence = String(count + 1).padStart(6, "0");
    return `CCA-${year}-${sequence}`; // Output: CCA-2026-000001
}

// Generator ID Kustom untuk Staff / Founders / Teacher
export async function generateEmployeeId(prefix: "DIR" | "STF" | "TCH" | "CNS"): Promise<string> {
    const count = await prisma.staffProfile.count();
    const sequence = String(count + 1).padStart(3, "0");
    return `EMP-${prefix}-${sequence}`; // Output: EMP-DIR-001 atau EMP-TCH-001
}

// Generator Nomor Invoice
export async function generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const count = await prisma.invoice.count();
    const sequence = String(count + 1).padStart(4, "0");

    return `INV/CCA/${year}/${month}/${sequence}`; // Output: INV/CCA/2026/09/0001
}