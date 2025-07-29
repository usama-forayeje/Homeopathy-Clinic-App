"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Plus,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Stethoscope,
  Activity,
  FileText,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import patientsService from "@/services/patients"
import consultationsService from "@/services/consultations"
import patientHabitsService from "@/services/patientHabits"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ConsultationHistoryTable } from "./ConsultationHistoryTable"
import { PatientHabitsDisplay } from "./PatientHabitsDisplay"

export function PatientDetailsPage({ patientId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch patient data
  const {
    data: patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsService.getPatient(patientId),
    enabled: !!patientId,
  })

  // Fetch patient consultations
  const { data: consultations = [], isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", "patient", patientId],
    queryFn: () => consultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
  })

  // Fetch patient habits
  const { data: patientHabits = [], isLoading: isLoadingHabits } = useQuery({
    queryKey: ["patientHabits", patientId],
    queryFn: () => patientHabitsService.getPatientHabitsByPatientId(patientId),
    enabled: !!patientId,
  })

  const isLoading = isLoadingPatient || isLoadingConsultations || isLoadingHabits

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (patientError || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-red-500 mb-4">
          <User className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Patient Not Found</h3>
          <p className="text-sm text-muted-foreground">
            {patientError?.message || "The requested patient could not be found."}
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    )
  }

  const calculateAge = (dob) => {
    if (!dob) return patient.age || "N/A"
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const latestConsultation = consultations[0]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/patients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{patient.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">Patient Details & Medical History</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button asChild variant="outline">
            <Link href={`/dashboard/patients/${patientId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Patient
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/consultations/new?patientId=${patientId}`}>
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </Link>
          </Button>
        </div>
      </div>

      {/* Patient Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription className="text-lg">
                {patient.gender} • {calculateAge(patient.dob)} years old
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Serial: {patient.serialNumber}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.phoneNumber}</span>
            </div>
            {patient.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.address}</span>
              </div>
            )}
            {patient.occupation && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.occupation}</span>
              </div>
            )}
            {patient.firstConsultationDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  First Visit: {new Date(patient.firstConsultationDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="consultations" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Consultations ({consultations.length})
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Consultation */}
            {latestConsultation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Latest Consultation
                  </CardTitle>
                  <CardDescription>
                    {new Date(latestConsultation.consultationDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Chief Complaint</h4>
                    <p className="text-sm">{latestConsultation.chiefComplaint}</p>
                  </div>
                  {latestConsultation.diagnosis && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Diagnosis</h4>
                      <p className="text-sm">
                        {Array.isArray(latestConsultation.diagnosis)
                          ? latestConsultation.diagnosis.join(", ")
                          : latestConsultation.diagnosis}
                      </p>
                    </div>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/consultations/${latestConsultation.$id}`}>View Full Consultation</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Consultations</span>
                  <Badge variant="secondary">{consultations.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tracked Habits</span>
                  <Badge variant="secondary">{patientHabits.length}</Badge>
                </div>
                {latestConsultation?.followUpDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Follow-up</span>
                    <Badge variant="outline">{new Date(latestConsultation.followUpDate).toLocaleDateString()}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <ConsultationHistoryTable consultations={consultations} patientId={patientId} />
        </TabsContent>

        <TabsContent value="habits">
          <PatientHabitsDisplay patientHabits={patientHabits} patientId={patientId} />
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Patient Timeline</CardTitle>
              <CardDescription>Chronological view of all patient interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.map((consultation, index) => (
                  <div key={consultation.$id} className="flex items-start space-x-4 pb-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Consultation #{consultations.length - index}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(consultation.consultationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{consultation.chiefComplaint}</p>
                      <Button asChild variant="link" size="sm" className="p-0 h-auto">
                        <Link href={`/dashboard/consultations/${consultation.$id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
