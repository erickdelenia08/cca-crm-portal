import { z } from "zod";
import { CourseCategory, CourseLevel } from "@prisma/client";

export const courseSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(1, "Kode kursus wajib diisi"),
    name: z.string().min(1, "Nama kursus wajib diisi"),
    category: z.nativeEnum(CourseCategory).default("LANGUAGE"),
    level: z.nativeEnum(CourseLevel).default("BASIC"),
    durationHours: z.coerce.number().min(0, "Durasi tidak boleh negatif").default(0),
    basePrice: z.coerce.number().min(0, "Harga tidak boleh negatif").default(0),
    isActive: z.boolean().default(true),
});

export type CourseInput = z.infer<typeof courseSchema>;
