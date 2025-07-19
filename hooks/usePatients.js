"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientService } from "@/services/patients"
import { useToast } from "@/hooks/use-toast"

export function usePatients(searchTerm = "", limit = 25, offset = 0) {
  return useQuery({
    queryKey: ["patients", { searchTerm, limit, offset }],
    queryFn: () => patientService.getPatients(limit, offset, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePatient(patientId) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientService.getPatient(patientId),
    enabled: !!patientId,
  })
}

export function useRecentPatients(limit = 10) {
  return useQuery({
    queryKey: ["patients", "recent", limit],
    queryFn: () => patientService.getRecentPatients(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast({
        title: "সফল!",
        description: "নতুন রোগী সফলভাবে যোগ করা হয়েছে।",
      })
    },
    onError: (error) => {
      toast({
        title: "ত্রুটি!",
        description: "রোগী যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      })
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ patientId, updateData }) => patientService.updatePatient(patientId, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patient", data.$id] })
      toast({
        title: "সফল!",
        description: "রোগীর তথ্য সফলভাবে আপডেট করা হয়েছে।",
      })
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "রোগীর তথ্য আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      })
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: patientService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast({
        title: "সফল!",
        description: "রোগী সফলভাবে মুছে ফেলা হয়েছে।",
      })
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "রোগী মুছে ফেলতে সমস্যা হয়েছে।",
        variant: "destructive",
      })
    },
  })
}
