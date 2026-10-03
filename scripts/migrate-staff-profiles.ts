import { prisma } from "../lib/prisma";

async function main() {
    const internalRoles = ["CONSULTANT", "TEACHER", "MANAGEMENT", "PROCESSING_DEPARTMENT"];
    
    const internalUsers = await prisma.user.findMany({
        where: {
            role: { in: internalRoles as any }
        },
        include: {
            staffProfile: true,
            consultantProfile: true,
        }
    });

    let createdCount = 0;

    for (const user of internalUsers) {
        if (!user.staffProfile) {
            const employeeNumber = user.consultantProfile?.employeeNumber;
            const fullName = user.consultantProfile?.fullName || user.name || "Employee";
            const phone = user.consultantProfile?.phone;
            
            await prisma.staffProfile.create({
                data: {
                    userId: user.id,
                    fullName: fullName,
                    employeeNumber: employeeNumber || undefined,
                    phone: phone || undefined,
                    department: user.department || undefined,
                    isActive: user.isActive,
                }
            });
            createdCount++;
            console.log(`Created StaffProfile for ${fullName} (${user.role})`);
        }
    }
    
    console.log(`Finished. Created ${createdCount} StaffProfiles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
