"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createUserSchema, assignMentorSchema } from "@/schemas/user.schema";
import bcrypt from "bcryptjs";
import { Role, Department } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const session = await auth();

    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            clientProfile: true,
            consultantProfile: true,
            staffProfile: true,

            clientAssignments: {
                where: {
                    endDate: null,
                },
                include: {
                    consultant: {
                        select: {
                            name: true,
                        },
                    },
                },
                take: 1,
            },

            consultantAssignments: {
                where: {
                    endDate: null,
                },
                select: {
                    id: true,
                },
            },
        },
    });

    return users.map((u) => {
        let autoId = "UNKNOWN";
        let assignedMentor: string | undefined;
        let assignedClientsCount: number | undefined;

        if (u.role === "CLIENT") {
            autoId = u.clientProfile?.clientNumber || "UNKNOWN";

            assignedMentor =
                u.clientAssignments[0]?.consultant.name || undefined;
        }

        if (u.role === "CONSULTANT") {
            autoId =
                u.consultantProfile?.employeeNumber || "UNKNOWN";

            assignedClientsCount =
                u.consultantAssignments.length;
        }

        if (
            u.role !== "CLIENT" &&
            u.role !== "CONSULTANT"
        ) {
            autoId =
                u.staffProfile?.employeeNumber || "UNKNOWN";
        }

        return {
            id: u.id,
            autoId,
            name: u.name || "-",
            email: u.email,
            role: u.role,
            assignedMentor,
            assignedClientsCount,
            status: u.isActive ? "ACTIVE" : "INACTIVE",
        };
    });
}

export async function getMentors() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    // If you need teachers as mentors, you'll have to pull from StaffProfile, 
    // but typically mentors are CONSULTANTs. We'll return CONSULTANTs for now.
    const mentors = await prisma.consultantProfile.findMany({
        include: { user: true },
        where: {
            user: {
                role: "CONSULTANT"
            }
        }
    });

    return mentors.map(m => ({
        id: m.id,
        name: m.user.name,
        role: m.user.role
    }));
}

// export async function getTeachers() {
//     const session = await auth();
//     if (!session || session.user.role !== "MANAGEMENT") {
//         throw new Error("UNAUTHORIZED");
//     }

//     const teachers = await prisma.staffProfile.findMany({
//         include: { user: true },
//         where: {
//             user: {
//                 role: "TEACHER"
//             }
//         }
//     });

//     return teachers.map(t => ({
//         id: t.id,
//         name: t.user.name,
//         role: t.user.role
//     }));
// }

export async function getTeachers() {
    const session = await auth();

    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const teachers = await prisma.staffProfile.findMany({
        where: {
            user: {
                role: "TEACHER",
            },
            isActive: true,
        },
        select: {
            id: true,
            fullName: true,
        },
        orderBy: {
            fullName: "asc",
        },
    });

    console.log(
        "TEACHERS:",
        teachers.map(t => ({
            staffProfileId: t.id,
            userId: t.id,
            name: t.fullName,
        }))
    );

    return teachers;
}

export async function createUser(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = createUserSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { name, email, role } = result.data;
    // const defaultPassword = "Cca@" + new Date().getFullYear();
    const defaultPassword = "password";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const id = crypto.randomUUID();

    const randomNum = Math.floor(1000 + Math.random() * 9000);

    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    id,
                    name,
                    email,
                    role,
                    passwordHash,
                }
            });

            if (role === "CLIENT") {
                await tx.clientProfile.create({
                    data: {
                        userId: id,
                        clientNumber: `CLT-${randomNum}`,
                        fullName: name || "",
                    }
                });
            } else if (role === "CONSULTANT") {
                await tx.consultantProfile.create({
                    data: {
                        userId: id,
                        employeeNumber: `CST-${randomNum}`,
                        fullName: name || "",
                    }
                });
            } else {
                let dept: Department = Department.DOCUMENT_PROCESSING;
                let prefix = "PRC";
                if (role === "MANAGEMENT") {
                    dept = Department.MANAGEMENT;
                    prefix = "MGT";
                } else if (role === "TEACHER") {
                    dept = Department.ACADEMIC;
                    prefix = "TCH";
                }

                await tx.staffProfile.create({
                    data: {
                        userId: id,
                        department: dept,
                        employeeNumber: `${prefix}-${randomNum}`,
                        fullName: name || "",
                    }
                });
            }
        });

        revalidatePath("/management/users");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Failed to create user: " + errorMessage);
    }
}

// export async function assignMentor(data: unknown) {
//     const session = await auth();
//     if (!session || session.user.role !== "MANAGEMENT") {
//         throw new Error("UNAUTHORIZED");
//     }

//     const result = assignMentorSchema.safeParse(data);
//     if (!result.success) {
//         throw new Error("Invalid assignment data");
//     }

//     const { studentId, consultantId } = result.data;

//     try {
//         // We need the student profile ID given a User ID
//         const studentProfile = await prisma.studentProfile.findUnique({
//             where: { userId: studentId }
//         });

//         if (!studentProfile) {
//             throw new Error("Student profile not found");
//         }

//         await prisma.studentProfile.update({
//             where: { id: studentProfile.id },
//             data: {
//                 assignedConsultantId: consultantId
//             }
//         });

//         revalidatePath("/management/users");
//         return { success: true };
//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : String(error);
//         throw new Error("Failed to assign mentor: " + errorMessage);
//     }
// }


export async function assignMentor(data: unknown) {
    const session = await auth();

    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = assignMentorSchema.safeParse(data);

    if (!result.success) {
        throw new Error("Invalid assignment data");
    }

    const { clientId, consultantId } = result.data;

    try {
        // Pastikan student benar-benar ada
        const client = await prisma.user.findUnique({
            where: {
                id: clientId,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!client || client.role !== "CLIENT") {
            throw new Error("Student not found");
        }

        // Pastikan consultant benar-benar ada
        const consultant = await prisma.user.findUnique({
            where: {
                id: consultantId,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!consultant || consultant.role !== "CONSULTANT") {
            throw new Error("Consultant not found");
        }

        // Tutup assignment consultant sebelumnya
        await prisma.clientConsultantAssignment.updateMany({
            where: {
                clientId,
                endDate: null,
            },
            data: {
                endDate: new Date(),
            },
        });

        // Buat assignment baru
        await prisma.clientConsultantAssignment.create({
            data: {
                clientId,
                consultantId,
                startDate: new Date(),
                isTemporary: false,
            },
        });

        revalidatePath("/management/users");

        return {
            success: true,
        };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);

        throw new Error("Failed to assign mentor: " + errorMessage);
    }
}