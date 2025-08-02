import z from "zod";

export const patientSchema = z.object({
    name: z.string().min(1, { message: "Patient name is required." }),
    age: z.coerce.number().min(0, { message: "Age cannot be negative." }).int({ message: "Age must be an integer." }),
    address: z.string().optional(),
    phoneNumber: z.string().min(10, { message: "Phone number is required and must be at least 10 digits." }),
    occupation: z.string().optional(),
    serialNumber: z.string().min(1, { message: "Serial number is required." }),
    gender: z.enum(["Male", "Female", "Other"], { message: "Gender is required." }),
    bloodGroup: z.string().optional(),
    notes: z.string().optional(),
    firstConsultationDate: z.string().min(1, { message: "First consultation date is required." }), // Input type="date" returns string
    dob: z.string().optional(), // Input type="date" returns string
});