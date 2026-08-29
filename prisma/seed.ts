import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";

async function main() {
    console.log("🌱 Seeding demo accounts...\n");

    for (const account of DEMO_ACCOUNTS) {
        const passwordHash = await bcrypt.hash(account.password, 10);

        const user = await prisma.user.upsert({
            where: {
                email: account.email,
            },
            update: {
                name: account.label,
                passwordHash,
                role: account.role,
                emailVerified: new Date(),
            },
            create: {
                email: account.email,
                name: account.label,
                passwordHash,
                role: account.role,
                emailVerified: new Date(),
            },
        });

        console.log(`✅ ${account.label}: ${user.email}`);
    }

    console.log("\n🎉 Seed completed!");
    console.log("\nDemo credentials:");
    console.log("------------------------------");

    for (const account of DEMO_ACCOUNTS) {
        console.log(
            `${account.label.padEnd(18)} ${account.email} / ${account.password}`,
        );
    }

    console.log("------------------------------");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });