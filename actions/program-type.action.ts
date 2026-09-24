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
            program: true,
            _count: {
                select: { enrollments: true, courses: true }
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
        programCount: t._count.courses + t._count.enrollments, // legacy field
        createdAt: t.createdAt.toISOString().split("T")[0],
    }));
}

export async function getProgramTypeById(id: string) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const type = await prisma.programType.findUnique({
        where: { id },
        include: {
            program: true,
            documentRequirements: true,
            courses: {
                include: {
                    classes: true
                }
            },
        }
    });

    return type;
}

export async function createProgramType(data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = programTypeSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id, documentRequirements, ...typeData } = result.data;

    try {
        await prisma.programType.create({
            data: {
                ...typeData,
                documentRequirements: {
                    create: (documentRequirements || []).map((req) => ({
                        name: req.name,
                        code: req.code,
                        description: req.description,
                        isRequired: req.isRequired,
                    })),
                }
            },
        });
        
        revalidatePath(`/management/programs/${typeData.programId}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal menyimpan program type: " + errorMessage);
    }
}

export async function updateProgramType(id: string, data: unknown) {
    const session = await auth();
    if (!session || session.user.role !== "MANAGEMENT") {
        throw new Error("UNAUTHORIZED");
    }

    const result = programTypeSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid form data");
    }

    const { id: _, documentRequirements, ...typeData } = result.data;

    try {
        await prisma.$transaction(async (tx) => {
            // Update scalar fields
            await tx.programType.update({
                where: { id },
                data: typeData,
            });

            // Delete old requirements
            await tx.documentRequirement.deleteMany({
                where: { programTypeId: id },
            });

            // Re-create new requirements
            if (documentRequirements && documentRequirements.length > 0) {
                await tx.documentRequirement.createMany({
                    data: documentRequirements.map((req) => ({
                        programTypeId: id,
                        name: req.name,
                        code: req.code,
                        description: req.description,
                        isRequired: req.isRequired,
                    })),
                });
            }
        });
        
        revalidatePath(`/management/programs/${typeData.programId}`);
        revalidatePath(`/management/programs/${typeData.programId}/products/${id}`);
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error("Gagal mengupdate program type: " + errorMessage);
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
            include: { _count: { select: { enrollments: true } } }
        });

        if (type && type._count.enrollments > 0) {
            throw new Error(`Program Type "${type.name}" tidak dapat dihapus karena masih ada enrollments.`);
        }

        await prisma.programType.delete({
            where: { id },
        });
        
        // Cannot easily revalidate exact path without programId, but typical usage:
        revalidatePath("/management/programs/[programId]", "page");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}
