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
            _count: {
                select: { programTypes: true }
            }
        },
        orderBy: { name: "asc" }
    });

    return programs.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description || '-',
        isActive: p.isActive,
        programTypeCount: p._count.programTypes,
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
            programTypes: {
                include: {
                    _count: {
                        select: { courses: true, enrollments: true }
                    }
                }
            }
        }
    });

    return program;
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

    const payload = result.data;
    const code = payload.code.trim().toUpperCase();

    const existing = await prisma.program.findUnique({
        where: { code }
    });

    if (existing) {
        throw new Error("Program code already exists");
    }

    try {
        await prisma.program.create({
            data: {
                name: payload.name.trim(),
                code,
                description: payload.description,
                isActive: payload.isActive,
            },
        });

        revalidatePath("/management/programs");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan program: " + errorMessage);
    }
}

export async function updateProgram(id: string, data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = programSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const payload = result.data;
    const code = payload.code.trim().toUpperCase();

    const existing = await prisma.program.findUnique({
        where: { code }
    });

    if (existing && existing.id !== id) {
        throw new Error("Program code already exists");
    }

    try {
        await prisma.program.update({
            where: { id },
            data: {
                name: payload.name.trim(),
                code,
                description: payload.description,
                isActive: payload.isActive,
            },
        });

        revalidatePath("/management/programs");
        revalidatePath(`/management/programs/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengupdate program: " + errorMessage);
    }
}

export async function toggleProgramStatus(id: string, isActive: boolean) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }
    
    try {
        await prisma.program.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath("/management/programs");
        revalidatePath(`/management/programs/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengupdate status program: " + errorMessage);
    }
}