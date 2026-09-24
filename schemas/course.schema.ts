import { z } from "zod";
import { CourseCategory, CourseLevel } from "@prisma/client";

export const courseSchema = z.object({
    id: z.string().optional(),
    programTypeId: z.string().min(1, "Program Type ID wajib diisi"),
    code: z.string().min(1, "Kode kursus wajib diisi"),
    name: z.string().min(1, "Nama kursus wajib diisi"),
    category: z.nativeEnum(CourseCategory),
    level: z.nativeEnum(CourseLevel),
    durationHours: z.coerce.number().min(0, "Durasi tidak boleh negatif"),
    basePrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
    isActive: z.boolean(),
});

export type CourseInput = z.infer<typeof courseSchema>;
