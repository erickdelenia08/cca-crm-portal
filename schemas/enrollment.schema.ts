import { z } from "zod";
import { EnrollmentStatus, CourseEnrollmentStatus } from "@prisma/client";

export const programEnrollmentSchema = z.object({
    clientId: z.string().min(1, "Client wajib dipilih"),
    programTypeId: z.string().min(1, "Program wajib dipilih"),
    consultantId: z.string().optional().nullable(),
    status: z.nativeEnum(EnrollmentStatus),
    notes: z.string().optional().nullable(),
    extendedData: z.record(z.unknown()).optional(), // For SERVICE specific data
});

export type ProgramEnrollmentInput = z.infer<typeof programEnrollmentSchema>;

export const courseEnrollmentSchema = z.object({
    clientId: z.string().min(1, "Client wajib dipilih"),
    courseClassId: z.string().min(1, "Kelas wajib dipilih"),
    programEnrollmentId: z.string().min(1, "Program Enrollment wajib diisi"),
    status: z.nativeEnum(CourseEnrollmentStatus),
    notes: z.string().optional().nullable(),
});

export type CourseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>;
