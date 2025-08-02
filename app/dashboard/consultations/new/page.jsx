"use client"

import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/common/PageContainer"
import { ArrowLeft, UserPlus, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { useCreatePatientConsultation } from "@/hooks/useConsultations"
import { PatientConsultationForm } from "@/components/forms"

function NewConsultationContent() {
  const router = useRouter()
  const createMutation = useCreatePatientConsultation({
    onSuccess: (data) => {
      router.push(`/dashboard/consultations/${data.newConsultation.$id}`)
    },
  })

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/consultations")
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-white to-green-50">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" asChild className="hover:bg-white/80 bg-transparent">
                  <Link href="/dashboard/consultations">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      New Patient Registration
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Register a new patient and record their first consultation
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Quick Actions</div>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/patients">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        View Patients
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Form */}
        <PatientConsultationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isPending}
          isEditing={false}
        />
      </div>
    </PageContainer>
  )
}

export default function NewConsultationPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <LoadingSpinner />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Loading Form</h3>
              <p className="text-gray-600">Preparing patient consultation form...</p>
            </div>
          </div>
        </PageContainer>
      }
    >
      <NewConsultationContent />
    </Suspense>
  )
}
