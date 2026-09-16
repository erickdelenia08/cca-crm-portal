"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { programTypeSchema } from "@/schemas/program-type.schema";
import { revalidatePath } from "next/cache";

export async function getProgramTypes() {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const types = await prisma.programType.findMany({
        include: {
            _count: {
                select: { programs: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return types.map(t => ({
        id: t.id,
        name: t.name,
        code: t.code,
        description: t.description || null,
        status: t.isActive ? "ACTIVE" : "INACTIVE" as "ACTIVE" | "INACTIVE",
        programCount: t._count.programs,
        createdAt: t.createdAt.toISOString().split("T")[0],
    }));
}

export async function upsertProgramType(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = programTypeSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, ...typeData } = result.data;

    try {
        if (id) {
            await prisma.programType.update({
                where: { id },
                data: typeData,
            });
        } else {
            await prisma.programType.create({
                data: typeData,
            });
        }
        revalidatePath("/management/program-types");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan program type: " + errorMessage);
    }
}

export async function deleteProgramType(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    try {
        const type = await prisma.programType.findUnique({
            where: { id },
            include: { _count: { select: { programs: true } } }
        });

        if (type && type._count.programs > 0) {
            throw new Error(`Program Type "${type.name}" tidak dapat dihapus karena masih digunakan oleh ${type._count.programs} program.`);
        }

        await prisma.programType.delete({
            where: { id },
        });
        
        revalidatePath("/management/program-types");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}
