"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageContainer } from "@/components/common/PageContainer"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  FileText,
  Plus,
  Stethoscope,
  Clock,
  TrendingUp,
  Heart,
  Pill,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import patientsService from "@/services/patients"
import patientConsultationsService from "@/services/patientConsultations"
import { ConsultationHistoryTable } from "@/components/patients/ConsultationHistoryTable"
import { PatientHabitsDisplay } from "@/components/patients/PatientHabitsDisplay"
import { toast } from "sonner"

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false)
  const patientId = params.patientId

  // Fetch patient details
  const {
    data: patient,
    isLoading: patientLoading,
    error: patientError,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsService.getPatient(patientId),
    enabled: !!patientId,
  })

  // Fetch patient consultations
  const { data: consultations = [], isLoading: consultationsLoading } = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => patientConsultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
  })

  // Create new consultation mutation
  const createConsultationMutation = useMutation({
    mutationFn: (consultationData) =>
      patientConsultationsService.createConsultationForExistingPatient(patientId, consultationData.consultationDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", patientId] })
      setIsNewConsultationOpen(false)
      toast.success("New consultation created successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to create consultation: ${error.message}`)
    },
  })

  const handleNewConsultation = async (formData) => {
    try {
      await createConsultationMutation.mutateAsync(formData)
    } catch (error) {
      console.error("Error creating consultation:", error)
    }
  }

  if (patientLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <LoadingSpinner />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading Patient Details</h3>
            <p className="text-gray-600">Fetching comprehensive patient information...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (patientError || !patient) {
    return (
      <PageContainer>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500 opacity-50" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Patient Not Found</h3>
            <p className="text-red-600 mb-4">{patientError?.message || "The requested patient could not be found."}</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/patients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const patientAge =
    patient.age || (patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : "N/A")

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-green-400 rounded-full opacity-10"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-5"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="icon" asChild className="hover:bg-white/80 bg-transparent">
                <Link href="/dashboard/patients">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>

              <div className="flex items-center space-x-3">
                <Button asChild variant="outline" className="hover:bg-white/80 bg-transparent">
                  <Link href={`/dashboard/patients/${patientId}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Patient
                  </Link>
                </Button>

                <Dialog open={isNewConsultationOpen} onOpenChange={setIsNewConsultationOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">New Consultation</DialogTitle>
                      <DialogDescription>Create a new consultation record for {patient.name}</DialogDescription>
                    </DialogHeader>
                    <PatientConsultationForm
                      onSubmit={handleNewConsultation}
                      isLoading={createConsultationMutation.isPending}
                      defaultPatient={{
                        ...patient,
                        consultationDetails: {
                          consultationDate: new Date().toISOString().split("T")[0],
                          consultationTime: new Date().toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }),
                          chamberId: "",
                          chiefComplaint: [""],
                          diagnosis: [""],
                          prescriptions: [],
                          dosageInstructions: [],
                          dietAndLifestyleAdvice: [],
                        },
                      }}
                      isEditing={false}
                      onCancel={() => setIsNewConsultationOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Patient Header Info */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {patient.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>ID: {patient.patientId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{patientAge} years old</span>
                  </div>
                  <Badge
                    className={`${
                      patient.gender === "Male"
                        ? "bg-blue-100 text-blue-800"
                        : patient.gender === "Female"
                          ? "bg-pink-100 text-pink-800"
                          : "bg-purple-100 text-purple-800"
                    } border-0`}
                  >
                    {patient.gender}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{consultations.length}</div>
                    <div className="text-sm text-gray-600">Consultations</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {patient.firstConsultationDate
                        ? new Date(patient.firstConsultationDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">First Visit</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {consultations.length > 0
                        ? new Date(consultations[0].consultationDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Last Visit</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Active</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <User className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="consultations"
              className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Consultations</span>
            </TabsTrigger>
            <TabsTrigger
              value="habits"
              className="flex items-center space-x-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              <Activity className="h-4 w-4" />
              <span>Habits</span>
            </TabsTrigger>
            <TabsTrigger
              value="prescriptions"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Pill className="h-4 w-4" />
              <span>Prescriptions</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patient ID</label>
                      <p className="text-lg font-mono text-gray-900">{patient.patientId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-lg font-semibold text-gray-900">{patientAge} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-lg font-semibold text-gray-900">{patient.gender}</p>
                    </div>
                    {patient.bloodGroup && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Blood Group</label>
                        <p className="text-lg font-semibold text-gray-900">{patient.bloodGroup}</p>
                      </div>
                    )}
                    {patient.occupation && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Occupation</label>
                        <p className="text-lg font-semibold text-gray-900">{patient.occupation}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-lg font-mono text-gray-900">{patient.phoneNumber}</p>
                  </div>
                  {patient.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Address</span>
                      </label>
                      <p className="text-gray-900 leading-relaxed">{patient.address}</p>
                    </div>
                  )}
                  {patient.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="text-gray-900 leading-relaxed">{patient.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest consultations and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.slice(0, 3).map((consultation) => (
                      <div key={consultation.$id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Consultation on {new Date(consultation.consultationDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {consultation.chiefComplaint?.[0] || "No chief complaint recorded"}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(consultation.consultationDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No consultations recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      <span>Consultation History</span>
                    </CardTitle>
                    <CardDescription>Complete medical consultation records</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {consultations.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ConsultationHistoryTable
                  consultations={consultations}
                  isLoading={consultationsLoading}
                  patientId={patientId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits">
            <PatientHabitsDisplay patientId={patientId} />
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-orange-600" />
                  <span>Prescription History</span>
                </CardTitle>
                <CardDescription>All prescribed medications and treatments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {consultations.some((c) => c.prescriptions?.length > 0) ? (
                  <div className="space-y-6">
                    {consultations
                      .filter((c) => c.prescriptions?.length > 0)
                      .map((consultation) => (
                        <div key={consultation.$id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">
                              {new Date(consultation.consultationDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h3>
                            <Badge variant="outline">{consultation.prescriptions?.length || 0} medicines</Badge>
                          </div>
                          <div className="grid gap-3">
                            {consultation.prescriptions?.map((prescription, index) => (
                              <div key={index} className="bg-orange-50 rounded-lg p-3">
                                <div className="font-medium text-gray-900">{prescription}</div>
                              </div>
                            ))}
                          </div>
                          {consultation.prescriptionNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{consultation.prescriptionNotes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions</h3>
                    <p className="text-gray-600">No medications have been prescribed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
