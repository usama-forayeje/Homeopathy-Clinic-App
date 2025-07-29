"use client"

import { PatientConsultationForm } from "@/components/forms/PatientConsultationForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/common/PageContainer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import patientConsultationsService from "@/services/patientConsultations"
import { toast } from "sonner"

export default function NewPatientPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createPatientAndConsultationMutation = useMutation({
    mutationFn: patientConsultationsService.createPatientAndFirstConsultation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      toast.success("New patient and consultation created successfully!")
      router.push(`/dashboard/consultations/${data.newConsultation.$id}`)
    },
    onError: (error) => {
      console.error("Error creating patient and consultation:", error)
      toast.error(`Failed to create patient: ${error.message}`)
    },
  })

  const handleSubmit = async (formData) => {
    console.log("Form data:", formData);

    try {
      await createPatientAndConsultationMutation.mutateAsync(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Patient & First Consultation</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add a new patient and record their first consultation
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <PatientConsultationForm
            onSubmit={handleSubmit}
            isLoading={createPatientAndConsultationMutation.isPending}
            isEditing={false}
          />
        </div>
      </div>
    </PageContainer>
  )
}
