"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Stethoscope, Activity, Pill, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { patientConsultationSchema } from "@/schemas/patientConsultation.schema"
import { toast } from "sonner"

// Custom Hooks
import { useFormStores } from "@/hooks/useFormStores"
import { useFormTabCompletion } from "@/hooks/useFormTabCompletion"

// Child Components
import { PatientDetailsForm } from "./PatientDetailsForm"
import { ConsultationDetailsForm } from "./ConsultationDetailsForm"
import { PrescriptionForm } from "./PrescriptionForm"
import { FormActions } from "./FormActions"
import { transformPatientDataForSubmission } from "@/lib/formTransformers"
import { HabitForm } from "./HabitsForm"

export function PatientConsultationForm({ onSubmit, isLoading, defaultPatient, isEditing = false, onCancel }) {
  const [activeTab, setActiveTab] = useState("patient")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Custom hook for fetching and managing store data
  const { habitDefinitions, medicines, instructions, chambers, isFormLoading } = useFormStores()

  const form = useForm({
    resolver: zodResolver(patientConsultationSchema),
    mode: "onChange",
    defaultValues: {
      patientDetails: {
        name: defaultPatient?.name || "",
        age: defaultPatient?.age || 0,
        dob: defaultPatient?.dob ? new Date(defaultPatient.dob).toISOString().split("T")[0] : "",
        gender: defaultPatient?.gender || "Male",
        phoneNumber: defaultPatient?.phoneNumber || "",
        address: defaultPatient?.address || "",
        occupation: defaultPatient?.occupation || "",
        patientId: defaultPatient?.patientId || `P${Date.now()}`,
        bloodGroup: defaultPatient?.bloodGroup || "",
        notes: defaultPatient?.notes || "",
      },
      consultationDetails: {
        consultationDate: new Date().toISOString().split("T")[0],
        consultationTime:
          defaultPatient?.consultationDetails?.consultationTime ||
          new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        chamberId: defaultPatient?.consultationDetails?.chamberId || "",
        chiefComplaint:
          defaultPatient?.consultationDetails?.chiefComplaint?.length > 0
            ? defaultPatient.consultationDetails.chiefComplaint
            : [""],
        symptoms: defaultPatient?.consultationDetails?.symptoms || "",
        BP: defaultPatient?.consultationDetails?.BP || "",
        Pulse: defaultPatient?.consultationDetails?.Pulse || "",
        Temp: defaultPatient?.consultationDetails?.Temp || "",
        historyOfPresentIllness: defaultPatient?.consultationDetails?.historyOfPresentIllness || "",
        familyHistory: defaultPatient?.consultationDetails?.familyHistory || "",
        otherComplaints: defaultPatient?.consultationDetails?.otherComplaints || [],
        diagnosis:
          defaultPatient?.consultationDetails?.diagnosis?.length > 0
            ? defaultPatient.consultationDetails.diagnosis
            : [""],
        O_E: defaultPatient?.consultationDetails?.O_E || "",
        prescriptions:
          defaultPatient?.consultationDetails?.prescriptions?.map((p) => ({
            medicineId: p.medicineId || "",
            dosage: p.dosage || "",
            notes: p.notes || "",
          })) || [],
        prescriptionNotes: defaultPatient?.consultationDetails?.prescriptionNotes || "",
        dosageInstructions: defaultPatient?.consultationDetails?.dosageInstructions || [],
        dietAndLifestyleAdvice: defaultPatient?.consultationDetails?.dietAndLifestyleAdvice || [],
        followUpDate: defaultPatient?.consultationDetails?.followUpDate
          ? new Date(defaultPatient.consultationDetails.followUpDate).toISOString().split("T")[0]
          : "",
        billAmount: defaultPatient?.consultationDetails?.billAmount || 0,
        notes: defaultPatient?.consultationDetails?.notes || "",
      },
      patientHabits:
        defaultPatient?.patientHabits?.map((h) => ({
          habitDefinitionId: h.habitDefinitionId || "",
          value: h.value || "",
          notes: h.notes || "",
        })) || [],
    },
  })

  // Custom hook for tab completion logic
  const { completedTabs } = useFormTabCompletion(form)

  const isFormDisabled = isLoading || isSubmitting || isFormLoading

  if (isFormLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Loading Form</h3>
          <p className="text-muted-foreground">Preparing your consultation interface...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { value: "patient", icon: User, label: "Patient", required: true },
    { value: "consultation", icon: Stethoscope, label: "Consultation", required: true },
    { value: "prescription", icon: Pill, label: "Prescription", required: false },
    { value: "habits", icon: Activity, label: "Habits", required: false },
  ]

  const handleFormSubmit = async (data) => {
    console.log("Form submission started with data:", data)

    try {
      setIsSubmitting(true)

      // Validate required fields
      if (!data.patientDetails.name || !data.patientDetails.age || !data.patientDetails.phoneNumber) {
        throw new Error("Patient details are incomplete")
      }

      if (!data.consultationDetails.consultationDate || !data.consultationDetails.chamberId) {
        throw new Error("Consultation details are incomplete")
      }

      if (!data.consultationDetails.chiefComplaint.some((c) => c && c.trim())) {
        throw new Error("At least one chief complaint is required")
      }

      if (!data.consultationDetails.diagnosis.some((d) => d && d.trim())) {
        throw new Error("At least one diagnosis is required")
      }

      // Use the external transformer utility
      const transformedData = transformPatientDataForSubmission(data)
      console.log("Transformed data for submission:", transformedData)

      await onSubmit(transformedData)

      toast.success(
        isEditing ? "Patient consultation updated successfully!" : "New patient consultation created successfully!",
      )
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error(`Submission Failed: ${error.message || "An unknown error occurred."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? "Update Patient" : "New Patient Consultation"}
            </h1>
            <p className="text-muted-foreground">Complete patient information and consultation details</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-xl p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                  {completedTabs.has(tab.value) && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {tab.required && !completedTabs.has(tab.value) && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="patient" className="space-y-6 mt-8">
              <PatientDetailsForm onNextTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="consultation" className="space-y-6 mt-8">
              <ConsultationDetailsForm onNextTab={setActiveTab} onPreviousTab={setActiveTab} chambers={chambers} />
            </TabsContent>

            <TabsContent value="prescription" className="space-y-6 mt-8">
              <PrescriptionForm
                onNextTab={setActiveTab}
                onPreviousTab={setActiveTab}
                medicines={medicines}
                instructions={instructions}
              />
            </TabsContent>

            <TabsContent value="habits">
              <HabitForm onPreviousTab={setActiveTab} habitDefinitions={habitDefinitions} />
            </TabsContent>
          </Tabs>

          <FormActions
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={onCancel}
            completedTabs={completedTabs}
            totalTabs={tabs.length}
            tabsArray={tabs.map((t) => t.value)}
            isFormDisabled={isFormDisabled}
          />
        </form>
      </FormProvider>
    </div>
  )
}
