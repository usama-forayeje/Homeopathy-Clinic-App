"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { consultationService } from "@/services/consultations"
import { useToast } from "@/hooks/use-toast"

export function useConsultations(limit = 25, offset = 0) {
  return useQuery({
    queryKey: ["consultations", { limit, offset }],
    queryFn: () => consultationService.getConsultations(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useConsultation(consultationId) {
  return useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => consultationService.getConsultation(consultationId),
    enabled: !!consultationId,
  })
}

export function usePatientConsultations(patientId, limit = 10) {
  return useQuery({
    queryKey: ["consultations", "patient", patientId, limit],
    queryFn: () => consultationService.getPatientConsultations(patientId, limit),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTodayConsultations() {
  return useQuery({
    queryKey: ["consultations", "today"],
    queryFn: consultationService.getTodayConsultations,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useCreateConsultation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: consultationService.createConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      toast({
        title: "সফল!",
        description: "নতুন কনসালটেশন সফলভাবে তৈরি করা হয়েছে।",
      })
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "কনসালটেশন তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ consultationId, updateData }) => consultationService.updateConsultation(consultationId, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      queryClient.invalidateQueries({ queryKey: ["consultation", data.$id] })
      toast({
        title: "সফল!",
        description: "কনসালটেশন সফলভাবে আপডেট করা হয়েছে।",
      })
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "কনসালটেশন আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      })
    },
  })
}
