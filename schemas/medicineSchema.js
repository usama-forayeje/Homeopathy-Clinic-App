import { z } from "zod";

export const medicineSchema = z.object({
    medicineName: z.string().min(1, "Medicine Name is required."),
    description: z.string().optional(),
    potency: z.string().optional(),
});