import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
