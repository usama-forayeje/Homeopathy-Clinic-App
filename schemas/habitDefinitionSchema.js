import { z } from 'zod';

export const habitDefinitionSchema = z.object({
    name: z.string().min(1, { message: "Habit name is required." }).max(100),
    inputType: z.enum(["boolean", "text", "select", "number", "scale"], {
        errorMap: () => ({ message: "Invalid input type selected." }),
    }),
    options: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
});