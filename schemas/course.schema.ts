import { z } from "zod";
import { CourseCategory, CourseLevel } from "@prisma/client";

export const courseSchema = z.object({
    id: z.string().optional(),
    programTypeId: z.string().min(1, "Program Type ID wajib diisi"),
    code: z.string().min(1, "Kode kursus wajib diisi"),
    name: z.string().min(1, "Nama kursus wajib diisi"),
    category: z.nativeEnum(CourseCategory).nullable().optional(),
    level: z.nativeEnum(CourseLevel).nullable().optional(),
    durationHours: z.coerce.number().min(0, "Durasi tidak boleh negatif").nullable().optional(),
    totalSessions: z.coerce.number().int().min(1, "Minimal 1 sesi").nullable().optional(),
    basePrice: z.coerce.number().min(0, "Harga tidak boleh negatif").nullable().optional(),
    description: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;
