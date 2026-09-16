import { z } from "zod";

export const availabilitySchema = z.object({
  type: z.enum(["RECURRING", "DATE"]),
  dayOfWeek: z.coerce.number().min(0).max(6, "Hari tidak valid").optional(),
  date: z.string().optional(), // YYYY-MM-DD
  startTime: z.string().min(1, "Waktu mulai wajib diisi"),
  endTime: z.string().min(1, "Waktu selesai wajib diisi"),
  duration: z.coerce.number().min(15, "Durasi minimal 15 menit"),
}).refine(data => {
  if (data.type === "RECURRING" && data.dayOfWeek === undefined) {
    return false;
  }
  if (data.type === "DATE" && !data.date) {
    return false;
  }
  return true;
}, {
  message: "Input tidak lengkap berdasarkan tipe ketersediaan",
  path: ["type"],
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
