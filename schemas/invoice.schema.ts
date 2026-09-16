import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Deskripsi layanan wajib diisi"),
  qty: z.coerce.number().min(1, "Kuantitas minimal 1"),
  discount: z.coerce.number().min(0, "Diskon tidak boleh negatif"),
  unitPrice: z.coerce.number().min(0, "Harga satuan tidak boleh negatif"),
});

export const invoiceSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  dueDate: z.string().min(1, "Tenggat waktu wajib diisi"),
  rate: z.string().optional(),
  studentId: z.string().min(1, "Klien wajib dipilih"),
  items: z.array(invoiceItemSchema).min(1, "Minimal 1 item layanan harus ditambahkan"),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
