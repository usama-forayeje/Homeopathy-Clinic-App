import { z } from "zod"

export const patientConsultationSchema = z.object({
  // Patient Details - Aligned with Appwrite schema
  patientDetails: z.object({
    name: z.string().min(2, "Patient name is required"),
    age: z.number().min(1, "Age is required").max(150, "Invalid age"),
    dob: z.string().optional(), // datetime in Appwrite
    gender: z.enum(["Male", "Female", "Other"], { message: "Please select gender" }),
    phoneNumber: z.string().min(11, "Valid phone number required"),
    address: z.string().optional(),
    occupation: z.string().optional(),
    patientId: z.string().min(1, "Patient ID is required"),
    bloodGroup: z.string().optional(),
    notes: z.string().optional(),
    firstConsultationDate: z.string().optional(), // Will be set automatically
  }),

  // Consultation Details - Aligned with Appwrite schema
  consultationDetails: z.object({
    consultationDate: z.string().min(1, "Consultation date is required"), // datetime
    chamberId: z.string().min(1, "Please select a chamber"),
    chiefComplaint: z
      .array(z.string().min(1, "Complaint cannot be empty"))
      .min(1, "At least one chief complaint is required"),
    symptoms: z.string().optional(),
    BP: z.string().optional(),
    Pulse: z.string().optional(),
    Temp: z.string().optional(),
    historyOfPresentIllness: z.string().optional(),
    familyHistory: z.string().optional(),
    otherComplaints: z.array(z.string()).optional(),
    diagnosis: z.array(z.string().min(1, "Diagnosis cannot be empty")).min(1, "At least one diagnosis is required"),
    O_E: z.string().optional(),
    prescriptions: z
      .array(z.string()) // Changed to string array to match Appwrite
      .optional(),
    prescriptionNotes: z.string().optional(),
    dosageInstructions: z.array(z.string()).optional(),
    dietAndLifestyleAdvice: z.array(z.string()).optional(),
    followUpDate: z.string().optional(), // datetime
    billAmount: z.number().min(0, "Bill amount cannot be negative").optional(), // double
    notes: z.string().optional(),
  }),

  // Patient Habits - Aligned with Appwrite schema
  patientHabits: z
    .array(
      z.object({
        habitDefinitionId: z.string().min(1, "Please select a habit type"),
        value: z.string().min(1, "Value is required"),
        patientId: z.string().optional(), // Will be set automatically
        consultationId: z.string().optional(), // Will be set automatically
        notes: z.string().optional(),
        recordedDate: z.string().optional(), // Will be set automatically
      }),
    )
    .optional(),
})
