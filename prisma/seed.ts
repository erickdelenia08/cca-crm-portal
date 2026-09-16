import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { Department, Role } from "@prisma/client";

async function main() {
    console.log("🌱 Seeding demo accounts...\n");

    let studentSeq = 1;
    let staffSeq = 1;
    let userSeq = 1;

    for (const account of DEMO_ACCOUNTS) {
        const passwordHash = await bcrypt.hash(account.password, 10);

        const userId = `USR-2026-${String(userSeq++).padStart(6, "0")}`;

        // =====================================================
        // DEPARTMENT
        // =====================================================

        let department: Department | null = null;

        switch (account.role) {
            case Role.MANAGEMENT:
                department = Department.MANAGEMENT;
                break;

            case Role.TEACHER:
                department = Department.ACADEMIC;
                break;

            case Role.PROCESSING_DEPARTMENT:
                department = Department.DOCUMENT_PROCESSING;
                break;

            case Role.CONSULTANT:
                department = Department.MANAGEMENT;
                break;

            case Role.STUDENT:
                department = null;
                break;
        }

        // =====================================================
        // USER
        // =====================================================

        const user = await prisma.user.upsert({
            where: {
                email: account.email,
            },

            update: {
                name: account.label,
                passwordHash,
                role: account.role,
                department,
                emailVerified: new Date(),
                isActive: true,
            },

            create: {
                id: userId,
                email: account.email,
                name: account.label,
                passwordHash,
                role: account.role,
                department,
                emailVerified: new Date(),
                isActive: true,
            },
        });

        // =====================================================
        // STUDENT
        // =====================================================

        if (account.role === Role.STUDENT) {
            const studentNumber =
                `CCA-STU-2026-${String(studentSeq++).padStart(4, "0")}`;

            await prisma.studentProfile.upsert({
                where: {
                    userId: user.id,
                },

                update: {
                    fullName: account.label,
                    email: account.email,
                },

                create: {
                    userId: user.id,
                    studentNumber,
                    fullName: account.label,
                    email: account.email,
                },
            });
        }

        // =====================================================
        // CONSULTANT
        // =====================================================

        else if (account.role === Role.CONSULTANT) {
            const employeeNumber =
                `EMP-CNS-${String(staffSeq++).padStart(3, "0")}`;

            await prisma.consultantProfile.upsert({
                where: {
                    userId: user.id,
                },

                update: {
                    fullName: account.label,
                    employeeNumber,
                    phone: null,
                    isAvailable: true,
                },

                create: {
                    userId: user.id,
                    employeeNumber,
                    fullName: account.label,
                    isAvailable: true,
                },
            });
        }

        // =====================================================
        // TEACHER
        // =====================================================

        else if (account.role === Role.TEACHER) {
            const employeeNumber =
                `EMP-TCH-${String(staffSeq++).padStart(3, "0")}`;

            await prisma.staffProfile.upsert({
                where: {
                    userId: user.id,
                },

                update: {
                    fullName: account.label,
                    employeeNumber,
                    position: "Teacher",
                    department: Department.ACADEMIC,
                    isActive: true,
                },

                create: {
                    userId: user.id,
                    employeeNumber,
                    fullName: account.label,
                    position: "Teacher",
                    department: Department.ACADEMIC,
                    isActive: true,
                },
            });
        }

        // =====================================================
        // MANAGEMENT
        // =====================================================

        else if (account.role === Role.MANAGEMENT) {
            const employeeNumber =
                `EMP-MGT-${String(staffSeq++).padStart(3, "0")}`;

            await prisma.staffProfile.upsert({
                where: {
                    userId: user.id,
                },

                update: {
                    fullName: account.label,
                    employeeNumber,
                    position: "Management",
                    department: Department.MANAGEMENT,
                    isActive: true,
                },

                create: {
                    userId: user.id,
                    employeeNumber,
                    fullName: account.label,
                    position: "Management",
                    department: Department.MANAGEMENT,
                    isActive: true,
                },
            });
        }

        // =====================================================
        // PROCESSING DEPARTMENT
        // =====================================================

        else if (account.role === Role.PROCESSING_DEPARTMENT) {
            const employeeNumber =
                `EMP-OPS-${String(staffSeq++).padStart(3, "0")}`;

            await prisma.staffProfile.upsert({
                where: {
                    userId: user.id,
                },

                update: {
                    fullName: account.label,
                    employeeNumber,
                    position: "Document Processing",
                    department: Department.DOCUMENT_PROCESSING,
                    isActive: true,
                },

                create: {
                    userId: user.id,
                    employeeNumber,
                    fullName: account.label,
                    position: "Document Processing",
                    department: Department.DOCUMENT_PROCESSING,
                    isActive: true,
                },
            });
        }

        console.log(
            `✅ ${account.label.padEnd(22)} | ${account.role.padEnd(22)} | ${user.email}`
        );
    }

    console.log("\n🎉 Seed completed!");
    console.log("\nDemo credentials:");
    console.log("------------------------------------------------------------");

    for (const account of DEMO_ACCOUNTS) {
        console.log(
            `${account.label.padEnd(22)} ${account.email.padEnd(30)} / ${account.password}`
        );
    }

    console.log("------------------------------------------------------------");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });