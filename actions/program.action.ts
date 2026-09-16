"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { programSchema } from "@/schemas/program.schema";
import { revalidatePath } from "next/cache";

export async function getPrograms() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const programs = await prisma.program.findMany({
        include: {
            type: true,
            _count: {
                select: { enrollments: { where: { status: "ACTIVE" } } }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return programs.map(p => ({
        id: p.id,
        title: p.name,
        type: p.type.code as 'STUDY_ABROAD' | 'VISA_HOLIDAY_WHV' | string,
        countryTarget: p.destination || '-',
        basePrice: Number(p.basePrice) || 0,
        activeClientsCount: p._count.enrollments,
    }));
}

export async function getProgramById(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            type: true,
            documentRequirements: true,
            _count: {
                select: { enrollments: true }
            }
        }
    });

    if (!program) return null;

    const activeClientsCount = await prisma.programEnrollment.count({
        where: { programId: id, status: "ACTIVE" }
    });
    
    const completedClientsCount = await prisma.programEnrollment.count({
        where: { programId: id, status: "COMPLETED" }
    });

    return {
        id: program.id,
        title: program.name,
        type: program.type.code,
        countryTarget: program.destination || '-',
        basePrice: Number(program.basePrice) || 0,
        status: program.isActive ? 'Active' : 'Inactive',
        description: program.description || '-',
        requirements: program.documentRequirements.map(req => req.name),
        stats: {
            totalClients: program._count.enrollments,
            activeClients: activeClientsCount,
            completedClients: completedClientsCount,
        }
    };
}

export async function createProgram(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = programSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, documentRequirements, ...programData } = result.data;

    try {
        const timestamp = Date.now().toString().slice(-4);
        const code = programData.name.substring(0, 3).toUpperCase() + "-" + timestamp;

        await prisma.program.create({
            data: {
                ...programData,
                code,
                documentRequirements: {
                    create: documentRequirements.map(req => ({
                        code: req.code,
                        name: req.name,
                        description: req.description,
                        isRequired: req.isRequired,
                    }))
                }
            },
        });
        
        revalidatePath("/management/programs");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan program: " + errorMessage);
    }
}
