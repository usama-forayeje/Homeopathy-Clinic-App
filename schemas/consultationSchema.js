// schemas/consultationSchema.js
import { z } from 'zod';

export const consultationSchema = z.object({
  consultationDate: z.string().min(1, "Consultation date is required."),
  chamberId: z.string().min(1, "Chamber is required."),
  billAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Bill amount cannot be negative.").optional().nullable().default(0)
  ),
  chiefComplaints: z.array(z.string()).default([]),
  symptoms: z.string().optional().default(""),
  BP: z.string().optional().default(""),
  Pulse: z.string().optional().default(""),
  Temp: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  followUpDate: z.string().optional().default(""),
  // **গুরুত্বপূর্ণ পরিবর্তন:** patientId কে optional() করা হয়েছে এবং default যোগ করা হয়েছে
  patientId: z.string().optional().default(""), // <--- এটি পরিবর্তন করুন
  otherComplaints: z.array(z.string()).default([]),
  diagnosis: z.array(z.string()).default([]),
  O_E: z.string().optional().default(""),
  historyOfPresentIllness: z.string().optional().default(""),
  advice: z.string().optional().default(""),
});