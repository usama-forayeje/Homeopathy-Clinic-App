"use client"

import patientsService from "@/services/patients"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function usePatients(searchTerm = "", limit = 25, offset = 0) {
  return useQuery({
    queryKey: ["patients", { searchTerm, limit, offset }],
    queryFn: () => patientsService.getPatients(limit, offset, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePatient(patientId) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsService.getPatient(patientId),
    enabled: !!patientId,
  })
}

export function useRecentPatients(limit = 10) {
  return useQuery({
    queryKey: ["patients", "recent", limit],
    queryFn: () => patientsService.getRecentPatients(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast.onSuccess("Patient created successfully.")
    },
    onError: (error) => {
      toast.error(`Failed to create patient: ${error.message}`)
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ patientId, updateData }) => patientsService.updatePatient(patientId, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patient", data.$id] })
      toast.success("Patient updated successfully.")
    },
    onError: () => {
      toast.error("Failed to update patient.")
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast.success("Patient deleted successfully.")
    },
    onError: () => {
      toast.error("Failed to delete patient.")
    },
  })
}
