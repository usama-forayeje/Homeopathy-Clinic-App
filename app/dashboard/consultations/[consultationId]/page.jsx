"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { PageContainer } from "@/components/common/PageContainer"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  FileText,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Heart,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useConsultation, useDeleteConsultation } from "@/hooks/useConsultations"

export default function ConsultationDetailsPage({ params }) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: consultation, isLoading, error } = useConsultation(params.consultationId)

  const deleteMutation = useDeleteConsultation({
    onSuccess: () => {
      toast.success("Consultation deleted successfully")
      router.push("/dashboard/consultations")
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.consultationId)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  if (isLoading) {
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

  if (error || !consultation) {
    return (
      <PageContainer>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500 opacity-50" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Consultation Not Found</h3>
            <p className="text-red-600 mb-4">{error?.message || "The requested consultation could not be found."}</p>
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

  const patient = consultation.patient
  const consultationDate = new Date(consultation.consultationDate)

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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {patient?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {patient?.name || "Unknown Patient"}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-1">
                      Consultation on{" "}
                      {consultationDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline">
                  <Link href={`/dashboard/consultations/${params.consultationId}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Consultation</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this consultation? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{patient?.age || "N/A"}</div>
                    <div className="text-sm text-gray-600">Years Old</div>
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
                      {consultationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="text-sm text-gray-600">Visit Date</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">৳{consultation.billAmount || 0}</div>
                    <div className="text-sm text-gray-600">Bill Amount</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{consultation.habits?.length || 0}</div>
                    <div className="text-sm text-gray-600">Habits Tracked</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Patient</span>
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center space-x-2">
              <Stethoscope className="h-4 w-4" />
              <span>Medical</span>
            </TabsTrigger>
            <TabsTrigger value="prescription" className="flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span>Prescription</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Habits</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Chief Complaints */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Chief Complaints</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {consultation.chiefComplaint?.length > 0 ? (
                    <div className="space-y-3">
                      {consultation.chiefComplaint.map((complaint, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                          <p className="text-gray-900">{complaint}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No chief complaints recorded</p>
                  )}
                </CardContent>
              </Card>

              {/* Diagnosis */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Diagnosis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {consultation.diagnosis?.length > 0 ? (
                    <div className="space-y-3">
                      {consultation.diagnosis.map((diagnosis, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <p className="text-gray-900">{diagnosis}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No diagnosis recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Vital Signs */}
            {(consultation.BP || consultation.Pulse || consultation.Temp) && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <span>Vital Signs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {consultation.BP && (
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{consultation.BP}</div>
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                      </div>
                    )}
                    {consultation.Pulse && (
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{consultation.Pulse}</div>
                        <div className="text-sm text-gray-600">Pulse Rate</div>
                      </div>
                    )}
                    {consultation.Temp && (
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{consultation.Temp}</div>
                        <div className="text-sm text-gray-600">Temperature</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Patient Tab */}
          <TabsContent value="patient">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900">{patient?.name || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patient ID</label>
                      <p className="text-lg font-mono text-gray-900">{patient?.patientId || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-lg font-semibold text-gray-900">{patient?.age || "N/A"} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <Badge
                        className={`
                        ${
                          patient?.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : patient?.gender === "Female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-purple-100 text-purple-800"
                        } border-0
                      `}
                      >
                        {patient?.gender || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Phone Number</span>
                      </label>
                      <p className="text-lg font-mono text-gray-900">{patient?.phoneNumber || "N/A"}</p>
                    </div>
                    {patient?.bloodGroup && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Blood Group</label>
                        <p className="text-lg font-semibold text-gray-900">{patient.bloodGroup}</p>
                      </div>
                    )}
                    {patient?.occupation && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Occupation</label>
                        <p className="text-lg font-semibold text-gray-900">{patient.occupation}</p>
                      </div>
                    )}
                    {patient?.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Address</span>
                        </label>
                        <p className="text-gray-900 leading-relaxed">{patient.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="consultation" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* History */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {consultation.symptoms && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Symptoms</label>
                      <p className="text-gray-900 mt-1">{consultation.symptoms}</p>
                    </div>
                  )}
                  {consultation.historyOfPresentIllness && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">History of Present Illness</label>
                      <p className="text-gray-900 mt-1">{consultation.historyOfPresentIllness}</p>
                    </div>
                  )}
                  {consultation.familyHistory && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Family History</label>
                      <p className="text-gray-900 mt-1">{consultation.familyHistory}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Examination */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                  <CardTitle>Physical Examination</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {consultation.O_E ? (
                    <div>
                      <label className="text-sm font-medium text-gray-500">On Examination</label>
                      <p className="text-gray-900 mt-1">{consultation.O_E}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No examination findings recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Notes */}
            {consultation.notes && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span>Additional Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-900 leading-relaxed">{consultation.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prescription Tab */}
          <TabsContent value="prescription">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-purple-600" />
                  <span>Prescription Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {consultation.prescriptions?.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Prescribed Medicines</h3>
                      <div className="space-y-3">
                        {consultation.prescriptions.map((prescription, index) => (
                          <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                            <p className="font-medium text-gray-900">{prescription}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {consultation.dosageInstructions?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Dosage Instructions</h3>
                        <div className="space-y-2">
                          {consultation.dosageInstructions.map((instruction, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-gray-900">{instruction}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {consultation.dietAndLifestyleAdvice?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Diet & Lifestyle Advice</h3>
                        <div className="space-y-2">
                          {consultation.dietAndLifestyleAdvice.map((advice, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg">
                              <p className="text-gray-900">{advice}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {consultation.prescriptionNotes && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Prescription Notes</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{consultation.prescriptionNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescription</h3>
                    <p className="text-gray-600">No medicines or treatments were prescribed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span>Patient Habits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {consultation.habits?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {consultation.habits.map((habit, index) => (
                      <div key={index} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Habit</label>
                            <p className="font-semibold text-gray-900">{habit.habitDefinitionId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Value</label>
                            <p className="text-gray-900">{habit.value}</p>
                          </div>
                          {habit.notes && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Notes</label>
                              <p className="text-gray-900 text-sm">{habit.notes}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-500">Recorded</label>
                            <p className="text-gray-600 text-sm">{new Date(habit.recordedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Habits Tracked</h3>
                    <p className="text-gray-600">No lifestyle habits were recorded for this consultation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Follow-up Information */}
        {consultation.followUpDate && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Follow-up scheduled:</strong>{" "}
              {new Date(consultation.followUpDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </PageContainer>
  )
}
