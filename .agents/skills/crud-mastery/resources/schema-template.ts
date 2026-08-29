import * as z from "zod";

export const ItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  published: z.boolean().default(false),
});

export type ItemValues = z.infer<typeof ItemSchema>;
