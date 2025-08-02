// src/schemas/fullFormSchema.js

import { z } from "zod";
import { patientSchema } from "./patientSchema";
import { consultationSchema } from "./consultationSchema";

// **প্রেসক্রিপশন এবং হ্যাবিটস-এর জন্য নতুন স্কিমা তৈরি করুন**
// এটি আপনার ফর্ম ডেটার গঠন অনুযায়ী হবে।
const prescriptionSchema = z.object({
  medicines: z.array(z.object({ // প্রতিটি ঔষধের জন্য নাম এবং ডোজ থাকতে পারে
    name: z.string().min(1, "Medicine name is required"),
    dosage: z.string().optional(),
  })).optional(),
  dosageInstructions: z.array(z.string()).optional(),
  prescriptionNotes: z.string().optional(),
});

const habitsAndHistorySchema = z.object({
  personalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  allergies: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  drugHistory: z.string().optional(),
  smokingHistory: z.string().optional(),
  alcoholHistory: z.string().optional(),
});


// প্রধান স্কিমা যা সব sub-schema কে একত্রিত করে
export const fullFormSchema = z.object({
  patientDetails: patientSchema,
  consultationDetails: consultationSchema,
  prescription: prescriptionSchema.optional(), // যেহেতু এটি "Coming Soon", তাই optional রাখা হলো
  habitsAndHistory: habitsAndHistorySchema.optional(), // এটিও optional
});