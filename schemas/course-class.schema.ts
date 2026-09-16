import { z } from "zod";

export const courseClassSchema = z.object({
    id: z.string().optional(),
    courseId: z.string().min(1, "Course ID is required"),
    code: z.string().min(1, "Kode Kelas / Batch wajib diisi"),
    teacherId: z.string().min(1, "Pengajar utama wajib dipilih"),
    schedule: z.string().min(1, "Jadwal pertemuan wajib diisi"),
    maxCapacity: z.coerce.number().min(1, "Kapasitas minimal 1 orang"),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
});

export type CourseClassInput = z.infer<typeof courseClassSchema>;
