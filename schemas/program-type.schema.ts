import { z } from "zod";
import { ServiceDeliveryType } from "@prisma/client";

export const documentRequirementSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama dokumen wajib diisi"),
    code: z.string().min(1, "Kode dokumen wajib diisi"),
    description: z.string().optional().nullable(),
    isRequired: z.boolean().default(true),
});

export const programTypeSchema = z.object({
    id: z.string().optional(),
    programId: z.string().min(1, "Program ID wajib diisi"),
    name: z.string().min(1, "Nama layanan (Program Type) wajib diisi"),
    code: z.string().min(1, "Code wajib diisi"),
    description: z.string().optional().nullable(),
    deliveryType: z.nativeEnum(ServiceDeliveryType).default("SERVICE"),
    isActive: z.boolean().default(true),
    documentRequirements: z.array(documentRequirementSchema).optional(),
});

export type ProgramTypeInput = z.infer<typeof programTypeSchema>;
