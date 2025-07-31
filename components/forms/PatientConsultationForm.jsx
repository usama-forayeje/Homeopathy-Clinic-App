"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { safeParseJSON } from "@/lib/utils"
import { toast } from "sonner"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icons
import {
  Loader2,
  Plus,
  Minus,
  User,
  Stethoscope,
  Activity,
  Pill,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Save,
  Clock,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
  Heart,
  AlertCircle,
  Target,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Utensils,
  Moon,
  Dumbbell,
  Coffee,
  Cigarette,
  Wine,
  Search,
  Filter,
  SortAsc,
  EyeOff,
} from "lucide-react"

// Custom Components
import { VoiceInput } from "../common/VoiceInput"
import { VoiceInputBn } from "../common/VoiceInputBn"

// Schema and Hooks
import { patientConsultationSchema } from "@/schemas/patientConsultation.schema"
import { useFormStores } from "@/hooks/useFormStores"
import { useFormTabCompletion } from "@/hooks/useFormTabCompletion"
import { LoadingSpinner } from "../common/LoadingSpinner"

// Enhanced habit category icons mapping
const habitCategoryIcons = {
  health: Heart,
  mental: Brain,
  diet: Utensils,
  sleep: Moon,
  exercise: Dumbbell,
  lifestyle: Coffee,
  addiction: Cigarette,
  social: Wine,
  default: Activity,
}

// Enhanced habit priority colors
const habitPriorityColors = {
  high: "border-red-500 bg-red-50 dark:bg-red-950",
  medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
  low: "border-green-500 bg-green-50 dark:bg-green-950",
  default: "border-orange-500 bg-orange-50 dark:bg-orange-950",
}

export function PatientConsultationForm({
  onSubmit,
  isLoading = false,
  defaultPatient = null,
  isEditing = false,
  onCancel,
  autoSave = false,
  showPreview = false,
}) {
  // ========================================== State Management ==========================================
  const [activeTab, setActiveTab] = useState("patient")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle") // idle, saving, saved, error

  // Enhanced Habits State
  const [habitSearchTerm, setHabitSearchTerm] = useState("")
  const [selectedHabitCategory, setSelectedHabitCategory] = useState("all")
  const [habitSortBy, setHabitSortBy] = useState("name")
  const [showHabitDetails, setShowHabitDetails] = useState(true)

  // ========================================== Custom Hooks ==========================================
  const { habitDefinitions, medicines, instructions, chambers, isFormLoading } = useFormStores()

  // ========================================== Form Setup ==========================================
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
        serialNumber: defaultPatient?.serialNumber || `P${Date.now()}`,
        bloodGroup: defaultPatient?.bloodGroup || "",
        notes: defaultPatient?.notes || "",
        firstConsultationDate: defaultPatient?.firstConsultationDate
          ? new Date(defaultPatient.firstConsultationDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      },
      consultationDetails: {
        consultationDate: new Date().toISOString().split("T")[0],
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
        dosageInstructions:
          defaultPatient?.consultationDetails?.dosageInstructions?.map((instruction) => ({
            predefinedInstruction:
              typeof instruction === "object" ? instruction.predefinedInstruction || "" : instruction,
            customInstruction: typeof instruction === "object" ? instruction.customInstruction || "" : "",
          })) || [],
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
          patientId: h.patientId || "",
          recordedDate: h.recordedDate || new Date().toISOString(),
        })) || [],
    },
  })

  // ========================================== Field Arrays ==========================================
  const {
    fields: complaintFields,
    append: appendComplaint,
    remove: removeComplaint,
  } = useFieldArray({ control: form.control, name: "consultationDetails.chiefComplaint" })

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({ control: form.control, name: "consultationDetails.diagnosis" })

  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({ control: form.control, name: "consultationDetails.prescriptions" })

  const {
    fields: habitFields,
    append: appendHabit,
    remove: removeHabit,
  } = useFieldArray({ control: form.control, name: "patientHabits" })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control: form.control, name: "consultationDetails.dosageInstructions" })

  const {
    fields: adviceFields,
    append: appendAdvice,
    remove: removeAdvice,
  } = useFieldArray({ control: form.control, name: "consultationDetails.dietAndLifestyleAdvice" })

  // ========================================== Tab Completion Logic ==========================================
  const { completedTabs } = useFormTabCompletion(form)

  // ========================================== Auto-save Logic ==========================================
  const formValues = form.watch()

  useEffect(() => {
    if (!autoSave || !isEditing) return

    const autoSaveTimer = setTimeout(async () => {
      if (form.formState.isValid && form.formState.isDirty) {
        try {
          setAutoSaveStatus("saving")
          await handleFormSubmit(formValues)
          setAutoSaveStatus("saved")
          setTimeout(() => setAutoSaveStatus("idle"), 2000)
        } catch (error) {
          setAutoSaveStatus("error")
          setTimeout(() => setAutoSaveStatus("idle"), 3000)
        }
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer)
  }, [formValues, autoSave, isEditing, form.formState.isValid, form.formState.isDirty])

  // ========================================== Age Calculation ==========================================
  const watchDob = form.watch("patientDetails.dob")

  useEffect(() => {
    if (watchDob) {
      try {
        const birthDate = new Date(watchDob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }

        if (age >= 0 && age <= 150) {
          form.setValue("patientDetails.age", age, { shouldValidate: true })
        }
      } catch (error) {
        console.error("Error calculating age:", error)
      }
    }
  }, [watchDob, form])

  // ========================================== Instruction Logic ==========================================
  const allDosageInstructions = form.watch("consultationDetails.dosageInstructions")

  useEffect(() => {
    if (!instructionFields || instructionFields.length === 0) return

    instructionFields.forEach((item, index) => {
      try {
        const currentPredefined = form.getValues(
          `consultationDetails.dosageInstructions.${index}.predefinedInstruction`,
        )
        const currentCustom = form.getValues(`consultationDetails.dosageInstructions.${index}.customInstruction`)

        if (currentPredefined && currentCustom !== "") {
          form.setValue(`consultationDetails.dosageInstructions.${index}.customInstruction`, "", {
            shouldValidate: true,
          })
        } else if (currentCustom && currentPredefined !== "") {
          form.setValue(`consultationDetails.dosageInstructions.${index}.predefinedInstruction`, "", {
            shouldValidate: true,
          })
        }
      } catch (error) {
        console.error(`Error handling instruction field ${index}:`, error)
      }
    })
  }, [allDosageInstructions, instructionFields, form])

  // ========================================== Enhanced Habit Logic ==========================================
  // Enhanced habit filtering and sorting
  const filteredAndSortedHabits = useMemo(() => {
    return habitDefinitions
      .filter((habit) => {
        const matchesSearch =
          habit.name.toLowerCase().includes(habitSearchTerm.toLowerCase()) ||
          (habit.description && habit.description.toLowerCase().includes(habitSearchTerm.toLowerCase()))
        const matchesCategory = selectedHabitCategory === "all" || habit.category === selectedHabitCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (habitSortBy) {
          case "name":
            return a.name.localeCompare(b.name)
          case "category":
            return (a.category || "").localeCompare(b.category || "")
          case "priority":
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          default:
            return 0
        }
      })
  }, [habitDefinitions, habitSearchTerm, selectedHabitCategory, habitSortBy])

  // Get unique categories for filter
  const habitCategories = useMemo(() => {
    return [...new Set(habitDefinitions.map((h) => h.category).filter(Boolean))]
  }, [habitDefinitions])

  // ========================================== Form Validation ==========================================
  const validateForm = useCallback(async () => {
    const errors = []
    const values = form.getValues()

    // Enhanced validation
    if (!values.patientDetails.name?.trim()) errors.push("Patient name is required")
    if (!values.patientDetails.age || values.patientDetails.age < 1) errors.push("Valid age is required")
    if (!values.patientDetails.phoneNumber?.trim()) errors.push("Phone number is required")
    if (!values.consultationDetails.consultationDate) errors.push("Consultation date is required")
    if (!values.consultationDetails.chamberId) errors.push("Chamber selection is required")
    if (!values.consultationDetails.chiefComplaint.some((c) => c.trim()))
      errors.push("At least one chief complaint is required")
    if (!values.consultationDetails.diagnosis.some((d) => d.trim())) errors.push("At least one diagnosis is required")

    setValidationErrors(errors)
    return errors.length === 0
  }, [form])

  // ========================================== Form Submission ==========================================
  const handleFormSubmit = async (data) => {
    console.log("🚀 Enhanced form submission started with data:", data)

    try {
      setIsSubmitting(true)

      // Enhanced validation with detailed error messages
      const isValid = await validateForm()
      if (!isValid) {
        toast.error("Please fix validation errors before submitting")
        return
      }

      // Enhanced data transformation with comprehensive processing
      const transformedData = {
        patientDetails: {
          ...data.patientDetails,
          name: data.patientDetails.name.trim(),
          phoneNumber: data.patientDetails.phoneNumber.trim(),
          address: data.patientDetails.address?.trim() || "",
          occupation: data.patientDetails.occupation?.trim() || "",
          notes: data.patientDetails.notes?.trim() || "",
          firstConsultationDate: data.patientDetails.firstConsultationDate,
          dob: data.patientDetails.dob ? new Date(data.patientDetails.dob).toISOString() : null,
        },
        consultationDetails: {
          ...data.consultationDetails,
          consultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
          followUpDate: data.consultationDetails.followUpDate
            ? new Date(data.consultationDetails.followUpDate).toISOString()
            : null,
          chiefComplaint: data.consultationDetails.chiefComplaint.filter((c) => c.trim()),
          diagnosis: data.consultationDetails.diagnosis.filter((d) => d.trim()),
          symptoms: data.consultationDetails.symptoms?.trim() || "",
          historyOfPresentIllness: data.consultationDetails.historyOfPresentIllness?.trim() || "",
          familyHistory: data.consultationDetails.familyHistory?.trim() || "",
          O_E: data.consultationDetails.O_E?.trim() || "",
          prescriptionNotes: data.consultationDetails.prescriptionNotes?.trim() || "",
          notes: data.consultationDetails.notes?.trim() || "",
          // Enhanced prescription handling
          prescriptions: (data.consultationDetails.prescriptions || [])
            .filter((p) => p.medicineId?.trim())
            .map((p) => p.medicineId.trim()),
          // Enhanced instructions handling
          dosageInstructions: (data.consultationDetails.dosageInstructions || [])
            .map((instruction) => {
              if (typeof instruction === "string") return instruction.trim()
              if (instruction.predefinedInstruction?.trim()) return instruction.predefinedInstruction.trim()
              if (instruction.customInstruction?.trim()) return instruction.customInstruction.trim()
              return null
            })
            .filter(Boolean),
          dietAndLifestyleAdvice: (data.consultationDetails.dietAndLifestyleAdvice || [])
            .filter((a) => a?.trim())
            .map((a) => a.trim()),
          otherComplaints: (data.consultationDetails.otherComplaints || [])
            .filter((c) => c?.trim())
            .map((c) => c.trim()),
        },
        patientHabits: (data.patientHabits || [])
          .filter((habit) => habit.habitDefinitionId && habit.value?.toString().trim())
          .map((habit) => ({
            ...habit,
            value: habit.value.toString().trim(),
            notes: habit.notes?.trim() || "",
            patientId: habit.patientId || "",
            recordedDate: habit.recordedDate || new Date().toISOString(),
          })),
      }

      console.log("✅ Enhanced transformed data for submission:", transformedData)

      // Call the onSubmit function with enhanced error handling
      await onSubmit(transformedData)

      toast.success(
        isEditing ? "Patient consultation updated successfully!" : "New patient consultation created successfully!",
        {
          description: `Patient: ${transformedData.patientDetails.name}`,
          duration: 5000,
        },
      )

      console.log("🎉 Form submitted successfully!")
    } catch (error) {
      console.error("❌ Enhanced form submission error:", error)
      toast.error(`Submission Failed: ${error.message || "An unknown error occurred."}`, {
        description: "Please check all required fields and try again.",
        duration: 7000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (data) => {
    await handleFormSubmit(data)
  }

  // ========================================== Loading States ==========================================
  const isFormDisabled = isLoading || isSubmitting || isFormLoading

  if (isFormLoading) {
    return <LoadingSpinner />
  }

  // ========================================== Tab Configuration ==========================================
  const tabs = [
    {
      value: "patient",
      icon: User,
      label: "Patient Info",
      required: true,
      description: "Basic patient information",
      color: "blue",
    },
    {
      value: "consultation",
      icon: Stethoscope,
      label: "Consultation",
      required: true,
      description: "Medical examination details",
      color: "green",
    },
    {
      value: "prescription",
      icon: Pill,
      label: "Treatment",
      required: false,
      description: "Medicines and instructions",
      color: "purple",
    },
    {
      value: "habits",
      icon: Activity,
      label: "Lifestyle",
      required: false,
      description: "Patient habits tracking",
      color: "orange",
    },
  ]

  // ========================================== Progress Calculation ==========================================
  const formProgress = useMemo(() => {
    const totalSections = 4
    const completedCount = completedTabs.size
    return Math.round((completedCount / totalSections) * 100)
  }, [completedTabs])

  // ========================================== Render Methods ==========================================
  const renderPatientTab = () => (
    <TabsContent value="patient" className="space-y-6 mt-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Patient Information</CardTitle>
                <CardDescription>Enter patient demographics and contact details</CardDescription>
              </div>
            </div>
            {completedTabs.has("patient") && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="patientDetails.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Name *
                  </FormLabel>
                  <FormControl>
                    <VoiceInput component={Input} placeholder="Enter full name" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Badge className="h-4 w-4" />
                    Serial Number *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated ID" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input type="date" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Age *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Years"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Gender *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl asChild> {/* Added asChild here */}
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+880 1XXX-XXXXXX" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Blood Group
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl asChild> {/* Added asChild here */}
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientDetails.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Occupation
                  </FormLabel>
                  <FormControl>
                    <VoiceInput component={Input} placeholder="Patient's occupation" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          {/* Address & Notes */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="patientDetails.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </FormLabel>
                  <FormControl>
                    <VoiceInput component={Textarea} placeholder="Complete address" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientDetails.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Additional Notes</FormLabel>
                  <FormControl>
                    <VoiceInput component={Textarea} placeholder="Any special notes, allergies, or important information" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">Step 1 of 4 - Patient Information</div>
            <Button
              type="button"
              onClick={() => setActiveTab("consultation")}
              disabled={!completedTabs.has("patient")}
              className="px-8"
            >
              Next: Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderConsultationTab = () => (
    <TabsContent value="consultation" className="space-y-6 mt-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Consultation Details</CardTitle>
                <CardDescription>Medical examination and diagnosis information</CardDescription>
              </div>
            </div>
            {completedTabs.has("consultation") && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Consultation Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="consultationDetails.consultationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Consultation Date *
                  </FormLabel>
                  <FormControl>
                    <Input type="date" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consultationDetails.chamberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Chamber *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl asChild> {/* Added asChild here */}
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select chamber" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chambers.map((chamber) => (
                        <SelectItem key={chamber.$id} value={chamber.$id}>
                          <div>
                            <div className="font-medium">{chamber.chamberName}</div>
                            <div className="text-sm text-muted-foreground">{chamber.location}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" /> Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="consultationDetails.BP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <Input placeholder="120/80 mmHg" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.Pulse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="72 bpm" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.Temp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input placeholder="98.6°F" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          {/* Chief Complaints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" /> Chief Complaints *
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendComplaint("")}>
                <Plus className="h-4 w-4 mr-2" /> Add Complaint
              </Button>
            </div>
            <div className="space-y-3">
              {complaintFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.chiefComplaint.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VoiceInput component={Textarea} placeholder={`Chief complaint ${index + 1}`} className="min-h-[60px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {complaintFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeComplaint(index)}
                      className="mt-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Diagnosis */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-500" /> Diagnosis *
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendDiagnosis("")}>
                <Plus className="h-4 w-4 mr-2" /> Add Diagnosis
              </Button>
            </div>
            <div className="space-y-3">
              {diagnosisFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.diagnosis.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VoiceInput component={Input} placeholder={`Diagnosis ${index + 1}`} className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {diagnosisFields.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeDiagnosis(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* History & Examination - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Patient History</h3>
              <FormField
                control={form.control}
                name="consultationDetails.symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Symptoms</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="Describe current symptoms" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.historyOfPresentIllness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History of Present Illness</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="Details about the present illness" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.familyHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family History</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="Relevant family medical history" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.otherComplaints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Complaints</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="Any other complaints not mentioned above" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Examination Findings</h3>
              <FormField
                control={form.control}
                name="consultationDetails.O_E"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>On Examination (O/E)</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="Physical examination findings" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultationDetails.notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Notes</FormLabel>
                    <FormControl>
                      <VoiceInput component={Textarea} placeholder="General consultation notes" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("patient")} className="px-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Patient Info
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("prescription")}
              disabled={!completedTabs.has("consultation")}
              className="px-8"
            >
              Next: Treatment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderPrescriptionTab = () => (
    <TabsContent value="prescription" className="space-y-6 mt-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Pill className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Treatment Plan</CardTitle>
                <CardDescription>Prescriptions and dosage instructions</CardDescription>
              </div>
            </div>
            {completedTabs.has("prescription") && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Prescriptions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="h-5 w-5 text-purple-500" /> Prescriptions
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendPrescription({ medicineId: "", dosage: "", notes: "" })}>
                <Plus className="h-4 w-4 mr-2" /> Add Medicine
              </Button>
            </div>
            <div className="space-y-4">
              {prescriptionFields.map((field, index) => (
                <Card key={field.id} className="p-4 shadow-sm border border-purple-200 dark:border-purple-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.medicineId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine Name</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!medicines || medicines.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {medicines.map((medicine) => (
                                <SelectItem key={medicine.$id} value={medicine.$id}>
                                  {medicine.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <VoiceInput component={Input} placeholder="e.g., 1+0+1, Before meal" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <VoiceInput component={Input} placeholder="Any specific notes for this medicine" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {prescriptionFields.length > 0 && (
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removePrescription(index)}>
                        <Minus className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
          <Separator />
          {/* Dosage Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-500" /> Dosage Instructions
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendInstruction({ predefinedInstruction: "", customInstruction: "" })}>
                <Plus className="h-4 w-4 mr-2" /> Add Instruction
              </Button>
            </div>
            <div className="space-y-4">
              {instructionFields.map((field, index) => (
                <Card key={field.id} className="p-4 shadow-sm border border-indigo-200 dark:border-indigo-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.dosageInstructions.${index}.predefinedInstruction`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Predefined Instruction</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!instructions || instructions.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select instruction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {instructions.map((instruction) => (
                                <SelectItem key={instruction.$id} value={instruction.instruction}>
                                  {instruction.instruction}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`consultationDetails.dosageInstructions.${index}.customInstruction`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Instruction</FormLabel>
                          <FormControl>
                            <VoiceInput component={Input} placeholder="Enter custom instruction" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {instructionFields.length > 0 && (
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeInstruction(index)}>
                        <Minus className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
          <Separator />
          {/* Diet and Lifestyle Advice */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Utensils className="h-5 w-5 text-yellow-500" /> Diet & Lifestyle Advice
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendAdvice("")}>
                <Plus className="h-4 w-4 mr-2" /> Add Advice
              </Button>
            </div>
            <div className="space-y-3">
              {adviceFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.dietAndLifestyleAdvice.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VoiceInput component={Textarea} placeholder={`Advice ${index + 1}`} className="min-h-[60px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {adviceFields.length > 0 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeAdvice(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Follow-up and Bill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="consultationDetails.followUpDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Follow-up Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consultationDetails.billAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Bill Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("consultation")} className="px-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Consultation
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("habits")}
              disabled={!completedTabs.has("prescription")}
              className="px-8"
            >
              Next: Lifestyle <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderHabitsTab = () => (
    <TabsContent value="habits" className="space-y-6 mt-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Patient Lifestyle & Habits</CardTitle>
                <CardDescription>Record and track patient's habits and lifestyle factors</CardDescription>
              </div>
            </div>
            {completedTabs.has("habits") && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Habits Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" /> Track Habits
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHabitDetails(!showHabitDetails)}
                    >
                      {showHabitDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showHabitDetails ? "Hide Details" : "Show Details"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle visibility of habit descriptions and priorities</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Habit Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search habits..."
                value={habitSearchTerm}
                onChange={(e) => setHabitSearchTerm(e.target.value)}
                className="col-span-1 md:col-span-2"
                prefix={<Search className="h-4 w-4 text-muted-foreground mr-2" />}
              />
              <Select onValueChange={setSelectedHabitCategory} value={selectedHabitCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {habitCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-medium text-muted-foreground">Available Habits ({filteredAndSortedHabits.length})</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select onValueChange={setHabitSortBy} value={habitSortBy}>
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              {filteredAndSortedHabits.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">No habits found matching your criteria.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedHabits.map((habit) => {
                    const Icon = habitCategoryIcons[habit.category] || habitCategoryIcons.default
                    const currentPatientHabit = habitFields.find(
                      (ph) => ph.habitDefinitionId === habit.$id,
                    )
                    const isSelected = !!currentPatientHabit

                    return (
                      <Card
                        key={habit.$id}
                        className={`p-4 transition-all duration-200 ${
                          isSelected ? "border-2 border-orange-500 shadow-lg" : "border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <h4 className="font-semibold text-base">{habit.name}</h4>
                          </div>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                appendHabit({
                                  habitDefinitionId: habit.$id,
                                  value: "", // Default empty value, user will fill
                                  notes: "",
                                  patientId: "", // Will be filled on form submission
                                  recordedDate: new Date().toISOString(),
                                })
                              } else {
                                const indexToRemove = habitFields.findIndex(
                                  (ph) => ph.habitDefinitionId === habit.$id,
                                )
                                if (indexToRemove !== -1) {
                                  removeHabit(indexToRemove)
                                }
                              }
                            }}
                          />
                        </div>
                        {showHabitDetails && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {habit.description && <p className="leading-relaxed">{habit.description}</p>}
                            <div className="flex items-center gap-2">
                              {habit.category && (
                                <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700">
                                  {habit.category}
                                </Badge>
                              )}
                              {habit.priority && (
                                <Badge className={`${habitPriorityColors[habit.priority] || habitPriorityColors.default}`}>
                                  {habit.priority} Priority
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div className="mt-4 space-y-3">
                            <FormField
                              control={form.control}
                              name={`patientHabits.${habitFields.findIndex(
                                ph => ph.habitDefinitionId === habit.$id
                              )}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Value/Status</FormLabel>
                                  <FormControl>
                                    <VoiceInput component={Input} placeholder="e.g., Daily, 3 times/week" className="h-9" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`patientHabits.${habitFields.findIndex(
                                ph => ph.habitDefinitionId === habit.$id
                              )}.notes`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Notes</FormLabel>
                                  <FormControl>
                                    <VoiceInput component={Textarea} placeholder="Any specific notes for this habit" className="min-h-[60px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("prescription")} className="px-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Treatment
            </Button>
            <Button type="submit" className="px-8" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Consultation" : "Create Consultation"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 p-4 md:p-6 lg:p-8">
        <Card className="border-0 shadow-lg bg-background">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              {isEditing ? "Edit Patient Consultation" : "New Patient Consultation"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg mt-2">
              {isEditing
                ? "Modify existing consultation details and treatment plans."
                : "Enter details for a new patient consultation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-save Status */}
            {autoSave && isEditing && (
              <div className="flex items-center justify-end text-sm text-muted-foreground">
                {autoSaveStatus === "saving" && (
                  <span className="flex items-center gap-1 text-blue-500 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving changes...
                  </span>
                )}
                {autoSaveStatus === "saved" && (
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="h-4 w-4" /> All changes saved!
                  </span>
                )}
                {autoSaveStatus === "error" && (
                  <span className="flex items-center gap-1 text-red-500">
                    <AlertTriangle className="h-4 w-4" /> Auto-save failed!
                  </span>
                )}
                {autoSaveStatus === "idle" && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-4 w-4" /> Idle
                  </span>
                )}
              </div>
            )}

            {/* Form Loading Indicator */}
            {isFormLoading && (
              <Alert className="mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Loading essential form data...</AlertDescription>
              </Alert>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold">Please correct the following errors:</p>
                  <ul className="list-disc list-inside mt-2">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isCompleted = completedTabs.has(tab.value)
                  const isCurrent = activeTab === tab.value
                  const isDisabled = tab.required && !isCompleted && !isCurrent && formProgress < 100 // Prevent skipping required incomplete tabs

                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      disabled={isDisabled}
                      className={`flex flex-col items-center justify-center p-3 text-sm transition-colors duration-200 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <Icon className={`h-5 w-5 mb-1 ${isCompleted ? "text-green-500" : ""}`} />
                      <span className="font-medium">{tab.label}</span>
                      <span className="text-xs">{tab.description}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <ScrollArea className="h-[calc(100vh-250px)] lg:h-[calc(100vh-200px)] p-4">
                {renderPatientTab()}
                {renderConsultationTab()}
                {renderPrescriptionTab()}
                {renderHabitsTab()}
              </ScrollArea>
            </Tabs>

            {/* Action Buttons */}
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center mt-6">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="text-sm text-muted-foreground">Progress: {completedTabs.size}/4 sections completed</div>
                <div className="flex space-x-2">
                  {["patient", "consultation", "prescription", "habits"].map((tab) => (
                    <div
                      key={tab}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${completedTabs.has(tab) ? "bg-green-500" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Debug: Form valid: {form.formState.isValid ? "Yes" : "No"} | Errors:{" "}
                    {Object.keys(form.formState.errors).length} | Submitting: {isSubmitting ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </CardContent>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}