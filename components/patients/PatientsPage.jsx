"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CirclePlus } from "lucide-react"
import Link from "next/link"
import { usePatientMutations, usePatients } from "@/hooks/usePatients"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual data fetching
  const { data: patients, isLoading, error } = usePatients(searchTerm);
  const { deletePatientMutation } = usePatientMutations();

  const handleDelete = async (patientId) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      await deletePatientMutation.mutateAsync(patientId);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="text-red-500">Data fetching error: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient List</h1>
        <Link href="/dashboard/patients/new">
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" /> Create a new patient
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search patients by Phone Number, Serial Number, or Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableCaption>Popular Homeo Care Patients List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Serial Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.$id}>
              <TableCell className="font-medium">{patient.serialNumber}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.contactNumber}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell className="text-right">
                <Link href={`/dashboard/patients/${patient.$id}`}>
                  <Button variant="outline" size="sm" className="mr-2">View</Button>
                </Link>
                <Link href={`/dashboard/patients/${patient.$id}/edit`}>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(patient.$id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
