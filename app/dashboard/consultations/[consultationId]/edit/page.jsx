"use client"

import { PatientConsultationForm } from "@/components/forms/PatientConsultationForm"
import { useConsultation, useUpdateConsultation } from "@/hooks/useConsultationQueries"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/common/PageContainer"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ArrowLeft, Edit, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Suspense } from "react"

function EditConsultationContent({ consultationId }) {
  const router = useRouter()

  const {
    data: consultation,
    isLoading: consultationLoading,
    error: consultationError,
  } = useConsultation(consultationId)

  const updateMutation = useUpdateConsultation({
    onSuccess: () => {
      router.push(`/dashboard/consultations/${consultationId}`)
    },
  })

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        consultationId,
        updateData: formData,
      })
    } catch (error) {
      console.error("Update submission error:", error)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/consultations/${consultationId}`)
  }

  if (consultationLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <LoadingSpinner />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading Consultation</h3>
            <p className="text-gray-600">Fetching consultation details...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (consultationError || !consultation) {
    return (
      <PageContainer>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500 opacity-50" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Consultation Not Found</h3>
            <p className="text-red-600 mb-4">
              {consultationError?.message || "The requested consultation could not be found."}
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/consultations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Consultations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  // Transform consultation data for form
  const defaultPatient = {
    ...consultation.patient,
    consultationDetails: {
      consultationDate: consultation.consultationDate
        ? new Date(consultation.consultationDate).toISOString().split("T")[0]
        : "",
      consultationTime: consultation.consultationDate
        ? new Date(consultation.consultationDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "",
      chamberId: consultation.chamberId || "",
      chiefComplaint: consultation.chiefComplaint || [""],
      symptoms: consultation.symptoms || "",
      BP: consultation.BP || "",
      Pulse: consultation.Pulse || "",
      Temp: consultation.Temp || "",
      historyOfPresentIllness: consultation.historyOfPresentIllness || "",
      familyHistory: consultation.familyHistory || "",
      otherComplaints: consultation.otherComplaints || [],
      diagnosis: consultation.diagnosis || [""],
      O_E: consultation.O_E || "",
      prescriptions: consultation.prescriptions || [],
      prescriptionNotes: consultation.prescriptionNotes || "",
      dosageInstructions: consultation.dosageInstructions || [],
      dietAndLifestyleAdvice: consultation.dietAndLifestyleAdvice || [],
      followUpDate: consultation.followUpDate ? new Date(consultation.followUpDate).toISOString().split("T")[0] : "",
      billAmount: consultation.billAmount || 0,
      notes: consultation.notes || "",
    },
    patientHabits: consultation.habits || [],
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 via-white to-yellow-50">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" asChild className="hover:bg-white/80 bg-transparent">
                  <Link href={`/dashboard/consultations/${consultationId}`}>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl">
                    <Edit className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Edit Consultation
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Update consultation for {consultation.patient?.name || "patient"}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-sm text-gray-500">Consultation ID</div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">{consultationId}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Update Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are editing an existing consultation. Changes will be saved immediately upon submission.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <PatientConsultationForm
          defaultPatient={defaultPatient}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateMutation.isPending}
          isEditing={true}
        />
      </div>
    </PageContainer>
  )
}

export default function EditConsultationPage({ params }) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <LoadingSpinner />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Loading Editor</h3>
              <p className="text-gray-600">Preparing consultation editor...</p>
            </div>
          </div>
        </PageContainer>
      }
    >
      <EditConsultationContent consultationId={params.consultationId} />
    </Suspense>
  )
}
