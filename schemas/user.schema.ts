import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Peran tidak valid" }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const assignMentorSchema = z.object({
  studentId: z.string().uuid("ID siswa tidak valid"),
  consultantId: z.string().uuid("ID mentor tidak valid"),
});

export type AssignMentorInput = z.infer<typeof assignMentorSchema>;
