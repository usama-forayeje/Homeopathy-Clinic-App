"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

// Import modular form sections
import { PatientDetailsSection } from "@/components/forms/PatientConsultationForm/sections/PatientDetailsSection"
import { ConsultationDetailsSection } from "@/components/forms/PatientConsultationForm/sections/ConsultationDetailsSection"
import { PrescriptionSection } from "@/components/forms/PatientConsultationForm/sections/PrescriptionSection"
import { HabitsSection } from "@/components/forms/PatientConsultationForm/sections/HabitsSection"
import { FormActionsSection } from "@/components/forms/PatientConsultationForm/sections/FormActionsSection"
import { FormTabNavigation } from "@/components/forms/PatientConsultationForm/components/FormTabNavigation"

// Import hooks and utilities
import { useFormStores } from "@/hooks/useFormStores"
import { useFormTabCompletion } from "@/hooks/useFormTabCompletion"
import { patientConsultationSchema } from "@/schemas/patientConsultation.schema"
import { transformFormDataForSubmission } from "@/components/forms/PatientConsultationForm/utils/dataTransformation"
import { generatePatientId } from "@/components/forms/PatientConsultationForm/utils/idGeneration"

// Form configuration
import { FORM_TABS_CONFIG } from "@/components/forms/PatientConsultationForm/config/formTabs"
import { FormHeader } from "./PatientConsultationForm/components/FormHeader"

/**
 * Main Patient Consultation Form Component
 *
 * This is the orchestrator component that manages:
 * - Form state and validation
 * - Tab navigation and completion tracking
 * - Data transformation for submission
 * - Integration with external stores and services
 *
 * @param {Object} props - Component props
 * @param {Object} defaultPatient - Default patient data for editing
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} onCancel - Form cancellation handler
 * @param {boolean} isLoading - Loading state from parent
 * @param {boolean} isEditing - Whether we're editing existing data
 */
export function PatientConsultationForm({
  defaultPatient = null,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) {
  // ========================================== STATE MANAGEMENT ==========================================
  const [activeTab, setActiveTab] = useState("patient")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitProgress, setSubmitProgress] = useState(0)

  // ========================================== EXTERNAL DATA ==========================================
  // Load form data from Zustand stores
  const { habitDefinitions, medicines, instructions, chambers, isFormLoading, errors } = useFormStores()

  // ========================================== FORM INITIALIZATION ==========================================
  // Generate unique patient ID for new patients
  const patientId = useMemo(() => {
    return defaultPatient?.patientId || generatePatientId()
  }, [defaultPatient?.patientId])

  // Enhanced form initialization with proper default values
  const defaultValues = useMemo(() => {
    const now = new Date()
    const currentDate = now.toISOString().split("T")[0]
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    return {
      // Patient Details Section
      patientDetails: {
        name: defaultPatient?.name || "",
        age: defaultPatient?.age || 0,
        dob: defaultPatient?.dob ? new Date(defaultPatient.dob).toISOString().split("T")[0] : "",
        gender: defaultPatient?.gender || "",
        phoneNumber: defaultPatient?.phoneNumber || "",
        address: defaultPatient?.address || "",
        occupation: defaultPatient?.occupation || "",
        patientId: patientId,
        serialNumber: defaultPatient?.serialNumber || "", // Doctor will enter this
        bloodGroup: defaultPatient?.bloodGroup || "",
        notes: defaultPatient?.notes || "",
        firstConsultationDate: defaultPatient?.firstConsultationDate || new Date().toISOString(),
      },
      // Consultation Details Section
      consultationDetails: {
        consultationDate: defaultPatient?.consultationDetails?.consultationDate || currentDate,
        consultationTime: defaultPatient?.consultationDetails?.consultationTime || currentTime,
        chamberId: defaultPatient?.consultationDetails?.chamberId || "", // Will be selected chamber ID
        chiefComplaint: defaultPatient?.consultationDetails?.chiefComplaint || [""],
        symptoms: defaultPatient?.consultationDetails?.symptoms || "",
        BP: defaultPatient?.consultationDetails?.BP || "",
        Pulse: defaultPatient?.consultationDetails?.Pulse || "",
        Temp: defaultPatient?.consultationDetails?.Temp || "",
        historyOfPresentIllness: defaultPatient?.consultationDetails?.historyOfPresentIllness || "",
        familyHistory: defaultPatient?.consultationDetails?.familyHistory || "",
        otherComplaints: defaultPatient?.consultationDetails?.otherComplaints || [],
        diagnosis: defaultPatient?.consultationDetails?.diagnosis || [""],
        O_E: defaultPatient?.consultationDetails?.O_E || "",
        prescriptions: defaultPatient?.consultationDetails?.prescriptions || [],
        prescriptionNotes: defaultPatient?.consultationDetails?.prescriptionNotes || "",
        dosageInstructions: defaultPatient?.consultationDetails?.dosageInstructions || [],
        dietAndLifestyleAdvice: defaultPatient?.consultationDetails?.dietAndLifestyleAdvice || [],
        followUpDate: defaultPatient?.consultationDetails?.followUpDate || "",
        billAmount: defaultPatient?.consultationDetails?.billAmount || 0,
        notes: defaultPatient?.consultationDetails?.notes || "",
      },
      // Patient Habits Section
      patientHabits: defaultPatient?.patientHabits || [],
    }
  }, [defaultPatient, patientId])

  // ========================================== FORM SETUP ==========================================
  // Initialize form with enhanced validation
  const form = useForm({
    resolver: zodResolver(patientConsultationSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  })

  // Tab completion tracking
  const { completedTabs } = useFormTabCompletion(form)

  // ========================================== FORM SUBMISSION ==========================================
  /**
   * Handle form submission with data transformation
   *
   * This function:
   * 1. Transforms form data to match expected API structure
   * 2. Handles progress tracking
   * 3. Manages error states
   * 4. Provides user feedback
   */
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      setSubmitProgress(10)

      console.log("🚀 Starting form submission...")
      console.log("📝 Raw form data:", formData)

      // Transform data for submission using utility function
      const transformedData = transformFormDataForSubmission(formData, {
        patientId,
        chambers,
        medicines,
        habitDefinitions,
      })

      console.log("✅ Transformed data for submission:", transformedData)
      setSubmitProgress(50)

      // Call the submission handler
      await onSubmit(transformedData)

      setSubmitProgress(100)

      toast.success(
        isEditing ? "Patient consultation updated successfully!" : "New patient consultation created successfully!",
        {
          description: `Patient: ${formData.patientDetails.name}`,
          duration: 5000,
        },
      )
    } catch (error) {
      console.error("❌ Form submission error:", error)
      toast.error("Failed to submit form", {
        description: error.message || "Please check your data and try again",
        duration: 7000,
      })
    } finally {
      setIsSubmitting(false)
      setSubmitProgress(0)
    }
  }

  // ========================================== TAB NAVIGATION ==========================================
  /**
   * Enhanced tab navigation with validation
   */
  const handleTabChange = useCallback((tabId) => {
    console.log(`📋 Navigating to tab: ${tabId}`)
    setActiveTab(tabId)
  }, [])

  const navigateToTab = useCallback((tabId) => {
    console.log(`➡️ Programmatic navigation to tab: ${tabId}`)
    setActiveTab(tabId)
  }, [])

  // ========================================== FORM STATE MANAGEMENT ==========================================
  // Loading state management
  const isFormDisabled = isLoading || isSubmitting || isFormLoading

  // Error handling for store data
  const hasStoreErrors = Object.values(errors).some((error) => error !== null)

  // Reset form when defaultPatient changes
  useEffect(() => {
    if (defaultPatient) {
      console.log("🔄 Resetting form with new default patient data")
      form.reset(defaultValues)
    }
  }, [defaultPatient, form, defaultValues])

  // Auto-save draft functionality (optional)
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isEditing && value.patientDetails?.name) {
        localStorage.setItem("consultation-draft", JSON.stringify(value))
        console.log("💾 Draft saved to localStorage")
      }
    })
    return () => subscription.unsubscribe()
  }, [form, isEditing])

  // ========================================== RENDER ==========================================
  return (
    <FormProvider {...form}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Form Header Component */}
        <FormHeader
          isEditing={isEditing}
          defaultPatient={defaultPatient}
          completedTabs={completedTabs}
          totalTabs={FORM_TABS_CONFIG.length}
          isSubmitting={isSubmitting}
          submitProgress={submitProgress}
        />

        {/* Store Loading/Error States */}
        {isFormLoading && (
          <Alert>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription>Loading form data (chambers, medicines, instructions, habits)...</AlertDescription>
          </Alert>
        )}

        {hasStoreErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some form data failed to load. Please refresh the page or contact support.
              <details className="mt-2 text-xs">
                {Object.entries(errors).map(
                  ([key, error]) =>
                    error && (
                      <div key={key}>
                        {key}: {error.message}
                      </div>
                    ),
                )}
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Form Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          {/* Tab Navigation Component */}
          <FormTabNavigation
            activeTab={activeTab}
            completedTabs={completedTabs}
            isFormDisabled={isFormDisabled}
            tabs={FORM_TABS_CONFIG}
          />

          {/* Form Content */}
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Patient Details Tab */}
            <TabsContent value="patient" className="space-y-6">
              <PatientDetailsSection onNextTab={navigateToTab} />
            </TabsContent>

            {/* Consultation Details Tab */}
            <TabsContent value="consultation" className="space-y-6">
              <ConsultationDetailsSection onNextTab={navigateToTab} onPreviousTab={navigateToTab} chambers={chambers} />
            </TabsContent>

            {/* Prescription Tab */}
            <TabsContent value="prescription" className="space-y-6">
              <PrescriptionSection
                onNextTab={navigateToTab}
                onPreviousTab={navigateToTab}
                medicines={medicines}
                instructions={instructions}
              />
            </TabsContent>

            {/* Habits Tab */}
            <TabsContent value="habits" className="space-y-6">
              <HabitsSection onPreviousTab={navigateToTab} habitDefinitions={habitDefinitions} />
            </TabsContent>

            {/* Form Actions */}
            <FormActionsSection
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              onCancel={onCancel}
              completedTabs={completedTabs}
              totalTabs={FORM_TABS_CONFIG.length}
              tabsArray={FORM_TABS_CONFIG.map((tab) => tab.id)}
              isFormDisabled={isFormDisabled}
            />
          </form>
        </Tabs>

        {/* Debug Panel (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-sm">🐛 Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>Active Tab: {activeTab}</div>
              <div>Completed Tabs: {Array.from(completedTabs).join(", ")}</div>
              <div>Form Valid: {form.formState.isValid ? "Yes" : "No"}</div>
              <div>Form Dirty: {form.formState.isDirty ? "Yes" : "No"}</div>
              <div>Patient ID: {patientId}</div>
              <div>Stores Loaded: {isFormLoading ? "Loading..." : "Ready"}</div>
              <div>Chambers: {chambers.length}</div>
              <div>Medicines: {medicines.length}</div>
              <div>Instructions: {instructions.length}</div>
              <div>Habit Definitions: {habitDefinitions.length}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </FormProvider>
  )
}
