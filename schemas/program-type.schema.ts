import { z } from "zod";

export const programTypeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama program type wajib diisi"),
    code: z.string().min(1, "Code program type wajib diisi"),
    description: z.string().optional(),
    isActive: z.boolean(),
});

export type ProgramTypeInput = z.infer<typeof programTypeSchema>;
