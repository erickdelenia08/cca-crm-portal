import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PayrollClient } from "./payroll-client";

export const dynamic = "force-dynamic";

export default async function AdminPayrollPage() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "MANAGEMENT") {
        redirect("/login");
    }

    // 1. Fetch historical / generated Payslips from the DB
    const payslips = await prisma.payslip.findMany({
        include: {
            staff: {
                select: { fullName: true, position: true, department: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Format for the client
    const formattedPayslips = payslips.map(p => ({
        id: p.id,
        staffId: p.staffId,
        name: p.staff.fullName,
        role: p.staff.position || p.staff.department || "Karyawan",
        periodStart: p.periodStart.toISOString(),
        periodEnd: p.periodEnd.toISOString(),
        baseSalary: Number(p.baseSalary),
        allowances: Number(p.allowances),
        deductions: Number(p.deductions),
        netSalary: Number(p.netSalary),
        pdfUrl: p.pdfUrl,
        createdAt: p.createdAt.toISOString(),
    }));

    // 2. Fetch all active staff for the configuration/generation view
    const activeStaff = await prisma.staffProfile.findMany({
        where: { isActive: true },
        select: {
            id: true,
            fullName: true,
            position: true,
            department: true,
            employeeNumber: true,
        }
    });

    return (
        <PayrollClient 
            initialPayslips={formattedPayslips} 
            activeStaff={activeStaff}
        />
    );
}