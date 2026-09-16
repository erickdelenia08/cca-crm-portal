import { z } from "zod";

export const bookingSchema = z.object({
  consultantId: z.string().min(1, "Konsultan wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib dipilih"),
  startTime: z.string().min(1, "Slot jam wajib dipilih"),
  endTime: z.string().min(1, "Waktu selesai wajib dihitung"),
  topic: z.string().min(5, "Topik pembahasan minimal 5 karakter"),
  sessionType: z.enum(["CONSULTATION", "DOCUMENT_REVIEW"]),
  availabilityTemplateId: z.string().optional(),
  availabilityOverrideId: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
