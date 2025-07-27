"use client"
import { PatientConsultationForm } from "@/components/forms/PatientConsultationForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/common/PageContainer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import patientsService from "@/services/patients"
import consultationsService from "@/services/consultations"
import patientHabitsService from "@/services/patientHabits"

export default function NewPatientPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const currentDoctorId = "doctor_abc123" // TODO: Get from auth context

  const createPatientMutation = useMutation({
    mutationFn: patientsService.createPatient,
  })

  const createConsultationMutation = useMutation({
    mutationFn: consultationsService.createConsultation,
  })

  const createPatientHabitMutation = useMutation({
    mutationFn: patientHabitsService.createPatientHabit,
  })

  const handleSubmit = async (formData) => {
    try {
      // Step 1: Create Patient
      const patientPayload = {
        name: formData.patientDetails.name,
        age: formData.patientDetails.age,
        gender: formData.patientDetails.gender,
        phoneNumber: formData.patientDetails.phoneNumber,
        address: formData.patientDetails.address,
        occupation: formData.patientDetails.occupation,
        serialNumber: formData.patientDetails.serialNumber,
      }

      const newPatient = await createPatientMutation.mutateAsync(patientPayload)
      const patientId = newPatient.$id

      // Step 2: Create Consultation
      const consultationPayload = {
        patientId: patientId,
        doctorId: currentDoctorId,
        date: formData.consultationDetails.date,
        time: formData.consultationDetails.time,
        complaint: formData.consultationDetails.complaint,
        diagnosis: formData.consultationDetails.diagnosis,
        medicines: formData.consultationDetails.medicines,
      }

      const newConsultation = await createConsultationMutation.mutateAsync(consultationPayload)
      const consultationId = newConsultation.$id

      // Step 3: Create Patient Habits
      for (const habit of formData.patientHabits) {
        const habitPayload = {
          habitDefinitionId: habit.habitDefinitionId,
          value: habit.value,
          notes: habit.notes,
          patientId: patientId,
          consultationId: consultationId,
        }
        await createPatientHabitMutation.mutateAsync(habitPayload)
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["consultations"] })

      // Navigate to consultation details
      router.push(`/dashboard/consultations/${consultationId}`)
    } catch (error) {
      console.error("ফর্ম জমা দিতে সমস্যা হয়েছে:", error)
    }
  }

  const isLoading =
    createPatientMutation.isPending || createConsultationMutation.isPending || createPatientHabitMutation.isPending

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">নতুন রোগী ও কনসালটেশন</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">নতুন রোগী যোগ করুন এবং প্রথম কনসালটেশন রেকর্ড করুন</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <PatientConsultationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            currentDoctorId={currentDoctorId}
            isEditing={false}
          />
        </div>
      </div>
    </PageContainer>
  )
}
