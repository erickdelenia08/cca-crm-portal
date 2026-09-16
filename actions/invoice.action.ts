"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { invoiceSchema, InvoiceInput } from "@/schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                student: true,
                items: true,
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, data: invoices };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getStudentsForInvoice() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        const students = await prisma.studentProfile.findMany({
            select: {
                id: true,
                studentNumber: true,
                fullName: true,
                email: true,
            },
            orderBy: { fullName: "asc" }
        });

        return { success: true, data: students };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function createInvoice(data: InvoiceInput) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        // Validate payload
        const parsed = invoiceSchema.parse(data);

        // Generate Invoice Number (e.g. INV/VIII/001/2026)
        const currentYear = new Date().getFullYear();
        const count = await prisma.invoice.count({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                }
            }
        });
        
        // Simple roman numeral for month (e.g., VIII)
        const monthNames = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        const currentMonth = monthNames[new Date().getMonth()];
        const invoiceNumber = `INV/${currentMonth}/${String(count + 1).padStart(3, '0')}/${currentYear}`;

        // Calculate Totals
        let subtotal = 0;
        const processedItems = parsed.items.map(item => {
            const itemTotal = (item.qty * item.unitPrice) - item.discount;
            subtotal += itemTotal > 0 ? itemTotal : 0;
            return {
                description: item.description,
                quantity: item.qty,
                unitPrice: item.unitPrice,
                discount: item.discount, // Note: not in db schema for InvoiceItem, we need to adapt
                // Wait, InvoiceItem schema does not have discount in DB! 
                // DB has: quantity, unitPrice, amount.
                amount: itemTotal > 0 ? itemTotal : 0
            };
        });

        // The DB schema for InvoiceItem does not have discount, so we just calculate amount directly.
        // Also wait, I need to check what fields exactly are in InvoiceItem DB schema.
        // id, invoiceId, description, quantity, unitPrice, amount.
        
        // Append Rate to notes
        let finalNotes = "";
        if (parsed.rate) {
            finalNotes += `Rate: ${parsed.rate}\n`;
        }

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                studentId: parsed.studentId,
                createdById: session.user.id,
                subtotal: subtotal,
                taxAmount: 0, // Implement if needed
                discountAmount: 0, // Implement if needed
                totalAmount: subtotal,
                dueDate: new Date(parsed.dueDate),
                status: "ISSUED", // Maps to UNPAID in UI
                notes: finalNotes.trim() === "" ? null : finalNotes.trim(),
                items: {
                    create: processedItems.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        amount: item.amount
                    }))
                }
            }
        });

        revalidatePath("/management/invoices");
        return { success: true, data: invoice };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
