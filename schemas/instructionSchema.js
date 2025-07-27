import { z } from "zod";

export const instructionSchema = z.object({
  instructionText: z.string().min(1, "Instruction Text is required."),
  notes: z.string().optional(), // Adding a notes field for more detail
});