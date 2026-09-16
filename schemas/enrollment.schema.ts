import { z } from "zod";
import { EnrollmentStatus, CourseEnrollmentStatus } from "@prisma/client";

export const programEnrollmentSchema = z.object({
    studentId: z.string().min(1, "Client wajib dipilih"),
    programId: z.string().min(1, "Program wajib dipilih"),
    consultantId: z.string().optional().nullable(),
    status: z.nativeEnum(EnrollmentStatus),
    notes: z.string().optional().nullable(),
});

export type ProgramEnrollmentInput = z.infer<typeof programEnrollmentSchema>;

export const courseEnrollmentSchema = z.object({
    studentId: z.string().min(1, "Client wajib dipilih"),
    courseClassId: z.string().min(1, "Kelas wajib dipilih"),
    status: z.nativeEnum(CourseEnrollmentStatus),
    notes: z.string().optional().nullable(),
});

export type CourseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>;
