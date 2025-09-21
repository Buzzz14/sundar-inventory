import * as z from "zod";

export const itemSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  company: z.string().optional(),
  description: z.string().optional(),
  cost_price: z
    .number({ message: "Cost price must be a number" })
    .min(0, "Cost price cannot be negative"),
  min_profit_percent: z
    .number({ message: "Min profit percent must be a number" })
    .min(0, "Min profit cannot be negative"),
  max_profit_percent: z
    .number({ message: "Max profit percent must be a number" })
    .min(0, "Max profit cannot be negative"),
  stock: z
    .number({ message: "Stock must be a number" })
    .min(0, "Stock cannot be negative")
    .optional(),
  reorder_level: z
    .number({ message: "Reorder level must be a number" })
    .min(0, "Reorder level cannot be negative")
    .optional(),
  photos: z.array(z.string().url()).optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
