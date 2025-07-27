import { z } from 'zod';

// ⭐ নতুন স্কিমা
export const patientHabitSchema = z.object({
  habitDefinitionId: z.string().min(1, { message: "Habit definition ID is required." }),
  value: z.string().min(1, { message: "Habit value is required." }).max(500), // মান স্ট্রিং হিসেবে থাকবে
  notes: z.string().nullable().optional(),
  patientId: z.string().min(1, { message: "Patient ID is required." }),
  consultationId: z.string().min(1, { message: "Consultation ID is required." }), // কনসাল্টেশন আইডি আবশ্যিক
});