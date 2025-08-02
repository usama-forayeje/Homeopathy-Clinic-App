import { User, Stethoscope, Pill, Activity } from "lucide-react"

/**
 * Form Tabs Configuration
 *
 * This configuration defines the structure and appearance of form tabs.
 * Each tab represents a major section of the patient consultation form.
 *
 * Tab Structure:
 * - id: Unique identifier for the tab
 * - label: Display name for the tab
 * - icon: Lucide React icon component
 * - description: Brief description of the tab's purpose
 * - color: Theme color for the tab (used in CSS classes)
 */
export const FORM_TABS_CONFIG = [
  {
    id: "patient",
    label: "Patient Info",
    icon: User,
    description: "Basic patient information and demographics",
    color: "blue",
  },
  {
    id: "consultation",
    label: "Consultation",
    icon: Stethoscope,
    description: "Medical examination and diagnosis details",
    color: "green",
  },
  {
    id: "prescription",
    label: "Prescription",
    icon: Pill,
    description: "Medicines, dosage, and treatment instructions",
    color: "purple",
  },
  {
    id: "habits",
    label: "Habits",
    icon: Activity,
    description: "Lifestyle habits and health tracking",
    color: "orange",
  },
]

/**
 * Tab Validation Rules
 *
 * Defines which fields are required for each tab to be considered "complete"
 */
export const TAB_VALIDATION_RULES = {
  patient: {
    required: ["patientDetails.name", "patientDetails.age", "patientDetails.phoneNumber"],
    description: "Patient name, age, and phone number are required",
  },
  consultation: {
    required: [
      "consultationDetails.consultationDate",
      "consultationDetails.chamberId",
      "consultationDetails.chiefComplaint",
      "consultationDetails.diagnosis",
    ],
    description: "Consultation date, chamber, chief complaint, and diagnosis are required",
  },
  prescription: {
    required: [], // Optional section
    description: "Prescription details are optional",
  },
  habits: {
    required: [], // Optional section
    description: "Habit tracking is optional",
  },
}
