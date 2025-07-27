"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, PlusCircle, History, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { PatientConsultationForm } from "@/components/forms/PatientConsultationForm"
import { PageContainer } from "@/components/common/PageContainer"
import consultationsService from "@/services/consultations"
import patientsService from "@/services/patients"
import patientHabitsService from "@/services/patientHabits"
import habitDefinitionsService from "@/services/habitDefinitions"
import Link from "next/link"

export default function ConsultationDetailsPage({ params }) {
  const { consultationId } = params
  const queryClient = useQueryClient()
  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const currentDoctorId = "doctor_abc123" // TODO: Get from auth context

  // Load current consultation data
  const {
    data: currentConsultation,
    isLoading: isLoadingCurrentConsultation,
    error: currentConsultationError,
  } = useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => consultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
    staleTime: 5 * 60 * 1000,
  })

  // Load patient data
  const {
    data: currentPatient,
    isLoading: isLoadingCurrentPatient,
    error: currentPatientError,
  } = useQuery({
    queryKey: ["patient", currentConsultation?.patientId],
    queryFn: () => patientsService.getPatientById(currentConsultation.patientId),
    enabled: !!currentConsultation?.patientId,
    staleTime: 5 * 60 * 1000,
  })

  // Load patient habits for this consultation
  const {
    data: currentPatientHabits,
    isLoading: isLoadingCurrentPatientHabits,
    error: currentPatientHabitsError,
  } = useQuery({
    queryKey: ["patientHabitsForConsultation", consultationId],
    queryFn: () => patientHabitsService.getPatientHabitsByConsultationId(consultationId),
    enabled: !!consultationId,
    staleTime: 5 * 60 * 1000,
  })

  // Load habit definitions
  const { data: habitDefinitions, isLoading: isLoadingHabitDefs } = useQuery({
    queryKey: ["habitDefinitions"],
    queryFn: habitDefinitionsService.getAllActiveHabitDefinitions,
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Load patient consultation history
  const {
    data: patientConsultationHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["patientConsultationHistory", currentPatient?.$id],
    queryFn: () => consultationsService.getConsultationsByPatientId(currentPatient.$id),
    enabled: !!currentPatient?.$id,
    staleTime: 5 * 60 * 1000,
  })

  // Mutations for creating new consultation
  const createConsultationMutation = useMutation({
    mutationFn: consultationsService.createConsultation,
  })

  const createPatientHabitMutation = useMutation({
    mutationFn: patientHabitsService.createPatientHabit,
  })

  const handleNewConsultationSubmit = async (formData) => {
    const patientIdToUse = currentPatient.$id

    try {
      // Create new consultation
      const consultationPayload = {
        patientId: patientIdToUse,
        doctorId: currentDoctorId,
        date: formData.consultationDetails.date,
        time: formData.consultationDetails.time,
        complaint: formData.consultationDetails.complaint,
        diagnosis: formData.consultationDetails.diagnosis,
        medicines: formData.consultationDetails.medicines,
      }

      const newConsultation = await createConsultationMutation.mutateAsync(consultationPayload)
      const newConsultationId = newConsultation.$id

      // Create patient habits for new consultation
      for (const habit of formData.patientHabits) {
        const habitPayload = {
          habitDefinitionId: habit.habitDefinitionId,
          value: habit.value,
          notes: habit.notes,
          patientId: patientIdToUse,
          consultationId: newConsultationId,
        }
        await createPatientHabitMutation.mutateAsync(habitPayload)
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      queryClient.invalidateQueries({ queryKey: ["patientConsultationHistory", patientIdToUse] })
      queryClient.invalidateQueries({ queryKey: ["patientHabitsForConsultation", newConsultationId] })

      setIsNewConsultationModalOpen(false)
    } catch (error) {
      console.error("ফর্ম জমা দিতে সমস্যা হয়েছে:", error)
    }
  }

  const isSavingNewConsultation = createConsultationMutation.isPending || createPatientHabitMutation.isPending

  if (isLoadingCurrentConsultation || isLoadingCurrentPatient || isLoadingCurrentPatientHabits || isLoadingHabitDefs) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">ডেটা লোড হচ্ছে...</span>
        </div>
      </PageContainer>
    )
  }

  if (currentConsultationError || currentPatientError || currentPatientHabitsError) {
    return (
      <PageContainer>
        <div className="text-red-500 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">ত্রুটি ঘটেছে</h2>
          <p>
            ডেটা লোড করতে সমস্যা হয়েছে:{" "}
            {currentConsultationError?.message || currentPatientError?.message || currentPatientHabitsError?.message}
          </p>
        </div>
      </PageContainer>
    )
  }

  if (!currentConsultation || !currentPatient) {
    return (
      <PageContainer>
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">কনসালটেশন পাওয়া যায়নি</h2>
          <p className="text-gray-600 dark:text-gray-400">
            নির্দিষ্ট ID ({consultationId}) সহ কোনো কনসালটেশন বা রোগী খুঁজে পাওয়া যায়নি।
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/consultations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">কনসালটেশন বিবরণ</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              রোগী: {currentPatient.name} ({currentPatient.serialNumber})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Dialog open={isNewConsultationModalOpen} onOpenChange={setIsNewConsultationModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন ফলো-আপ কনসালটেশন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>নতুন ফলো-আপ কনসালটেশন</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <PatientConsultationForm
                  onSubmit={handleNewConsultationSubmit}
                  isLoading={isSavingNewConsultation}
                  currentDoctorId={currentDoctorId}
                  defaultPatient={currentPatient}
                  isEditing={false}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                পূর্ববর্তী ইতিহাস
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>রোগীর পূর্ববর্তী কনসালটেশন ইতিহাস</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="ml-2">ইতিহাস লোড হচ্ছে...</span>
                  </div>
                ) : historyError ? (
                  <div className="text-red-500">ইতিহাস লোড করতে সমস্যা হয়েছে: {historyError.message}</div>
                ) : patientConsultationHistory && patientConsultationHistory.length > 0 ? (
                  patientConsultationHistory
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((historyConsultation) => (
                      <Card key={historyConsultation.$id} className="relative group">
                        <CardHeader>
                          <CardTitle>তারিখ: {new Date(historyConsultation.date).toLocaleDateString("bn-BD")}</CardTitle>
                          <CardDescription>সময়: {historyConsultation.time}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>অভিযোগ:</strong> {historyConsultation.complaint}
                          </p>
                          <p>
                            <strong>রোগ নির্ণয়:</strong> {historyConsultation.diagnosis || "নেই"}
                          </p>
                          <p>
                            <strong>ঔষধ:</strong> {historyConsultation.medicines || "নেই"}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground">কোনো পূর্ববর্তী কনসালটেশন ইতিহাস নেই।</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Consultation Details */}
        <Card>
          <CardHeader>
            <CardTitle>বর্তমান কনসালটেশন ({new Date(currentConsultation.date).toLocaleDateString("bn-BD")})</CardTitle>
            <CardDescription>সময়: {currentConsultation.time}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">রোগীর অভিযোগ:</h3>
              <p>{currentConsultation.complaint}</p>
            </div>
            <div>
              <h3 className="font-semibold">রোগ নির্ণয়:</h3>
              <p>{currentConsultation.diagnosis || "নেই"}</p>
            </div>
            <div>
              <h3 className="font-semibold">ঔষধ:</h3>
              <p>{currentConsultation.medicines || "নেই"}</p>
            </div>

            <Separator />

            <h3 className="font-semibold mb-3">রোগীর অভ্যাস:</h3>
            {currentPatientHabits && currentPatientHabits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPatientHabits.map((habit) => {
                  const definition = habitDefinitions?.find((def) => def.$id === habit.habitDefinitionId)
                  return (
                    <Card key={habit.$id} className="p-3">
                      <CardTitle className="text-base">{definition?.name || "অভ্যাস নাম নেই"}</CardTitle>
                      <CardContent className="p-0">
                        <p>মান: {habit.value}</p>
                        {habit.notes && <p className="text-sm text-muted-foreground">নোট: {habit.notes}</p>}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">এই কনসালটেশনে কোনো অভ্যাস রেকর্ড করা হয়নি।</p>
            )}
          </CardContent>
        </Card>

        {/* Patient Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>রোগীর মৌলিক তথ্য</CardTitle>
            <CardDescription>{currentPatient.serialNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>নাম:</strong> {currentPatient.name}
            </p>
            <p>
              <strong>বয়স:</strong> {currentPatient.age}
            </p>
            <p>
              <strong>লিঙ্গ:</strong> {currentPatient.gender}
            </p>
            <p>
              <strong>ফোন নম্বর:</strong> {currentPatient.phoneNumber}
            </p>
            <p>
              <strong>ঠিকানা:</strong> {currentPatient.address || "নেই"}
            </p>
            <p>
              <strong>পেশা:</strong> {currentPatient.occupation || "নেই"}
            </p>
            <p>
              <strong>শেষ পরিদর্শনের তারিখ:</strong>{" "}
              {currentPatient.lastVisitDate
                ? new Date(currentPatient.lastVisitDate).toLocaleDateString("bn-BD")
                : "নেই"}
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
