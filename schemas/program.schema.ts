import { z } from "zod";

export const programSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama Program (Brand) wajib diisi"),
    code: z.string().min(1, "Kode unik wajib diisi (e.g. CCABROAD)"),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
});

export type ProgramInput = z.infer<typeof programSchema>;
