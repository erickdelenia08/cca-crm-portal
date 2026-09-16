import { z } from "zod";

export const documentRequirementSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(1, "Code wajib diisi"),
    name: z.string().min(1, "Nama dokumen wajib diisi"),
    description: z.string().optional().nullable(),
    isRequired: z.boolean(),
});

export const programSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama program wajib diisi"),
    typeId: z.string().min(1, "Tipe program wajib dipilih"),
    destination: z.string().min(1, "Negara tujuan wajib dipilih"),
    basePrice: z.number().min(0, "Biaya jasa tidak valid"),
    description: z.string().optional().nullable(),
    isActive: z.boolean(),
    documentRequirements: z.array(documentRequirementSchema).min(1, "Minimal satu persyaratan dokumen harus ada"),
});

export type DocumentRequirementInput = z.infer<typeof documentRequirementSchema>;
export type ProgramInput = z.infer<typeof programSchema>;
