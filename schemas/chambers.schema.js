
import { z } from 'zod';

export const chamberSchema = z.object({
    chamberName: z.string().min(3, { message: "chamber name must be at least 3 characters long" }).max(100, { message: "chamber name must be at most 100 characters long" }),
    location: z.string().min(5, { message: "Address must be at least 5 characters long" }).max(200, { message: "Address must be at most 200 characters long" }),
    contactNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }).max(200, { message: "Phone number must be at most 20 digits" }),
    contactPerson: z.string().min(3, { message: "Contact person name must be at least 3 characters long" }).max(100, { message: "Contact person name must be at most 100 characters long" }).nullable().optional(),
    openingHours: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});