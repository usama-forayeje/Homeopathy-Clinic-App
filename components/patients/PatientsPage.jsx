"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Phone, Calendar, User, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeletePatient, usePatients } from "@/hooks/usePatients"

export function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: patients = [], isLoading, error } = usePatients(debouncedSearchTerm)
  const deletePatient = useDeletePatient()

  const handleDeletePatient = async (patientId, patientName) => {
    try {
      await deletePatient.mutateAsync(patientId)
      toast.success(`Patient ${patientName} deleted successfully`)
    } catch (error) {
      toast.error(`Failed to delete patient: ${error.message}`)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-red-500 mb-4">
          <User className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Error Loading Patients</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your patient records and consultations</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/patients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, phone number, or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.$id} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.gender} • {patient.age} years old
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/patients/${patient.$id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/patients/${patient.$id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Patient
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/consultations/new?patientId=${patient.$id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Consultation
                      </Link>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Patient
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the patient record for{" "}
                            <strong>{patient.name}</strong> and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePatient(patient.$id, patient.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                {patient.phoneNumber}
              </div>
              {patient.firstConsultationDate && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  First Visit: {new Date(patient.firstConsultationDate).toLocaleDateString()}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Serial: {patient.serialNumber}</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href={`/dashboard/patients/${patient.$id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {patients.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No patients found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm ? "No patients match your search criteria." : "Get started by adding your first patient."}
            </p>
            <Button asChild>
              <Link href="/dashboard/patients/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Patient
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
