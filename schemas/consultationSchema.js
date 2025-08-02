
import { z } from 'zod';

export const consultationSchema = z.object({
  consultationDate: z.string().min(1, "Consultation date is required."),
  chamberId: z.string().min(1, "Chamber is required."),
  billAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Bill amount cannot be negative.").optional().nullable().default(0) // Default to 0 for numbers
  ),
  // --- IMPORTANT CHANGE HERE ---
  chiefComplaint: z.array(z.object({ value: z.string().min(1, "Chief complaint cannot be empty") })).optional().default([]),
  // --- IMPORTANT CHANGE HERE ---
  symptoms: z.string().optional().default(""),
  BP: z.string().optional().default(""),
  Pulse: z.string().optional().default(""),
  Temp: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  followUpDate: z.string().optional().default(""),
  // patientId should ideally be set during submission, not rely on a default empty string for validation
  // It's usually better to have this handled by `onSubmit` logic or a specific transformation if needed for validation.
  // For now, let's keep it optional string if it's always set later.
  patientId: z.string().optional().default(""),
  // --- IMPORTANT CHANGE HERE ---
  otherComplaints: z.array(z.object({ value: z.string().min(1, "Other complaint cannot be empty") })).optional().default([]),
  diagnosis: z.array(z.object({ value: z.string().min(1, "Diagnosis cannot be empty") })).optional().default([]),
  // --- IMPORTANT CHANGE HERE ---
  O_E: z.string().optional().default(""),
  historyOfPresentIllness: z.string().optional().default(""),
  advice: z.string().optional().default(""),
});