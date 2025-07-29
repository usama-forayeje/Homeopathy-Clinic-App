"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import consultationsService from "@/services/consultations";


// ========================================== Core Consultation Hooks =======================================

export function useConsultation(consultationId) {
  return useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => consultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePatientConsultations(patientId) {
  return useQuery({
    queryKey: ["consultations", "patient", patientId],
    queryFn: () => consultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTodayConsultations() {
  return useQuery({
    queryKey: ["consultations", "today"],
    queryFn: () => consultationsService.getTodayConsultations(), // Assuming this exists in your service
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// ========================================== Patient Consultation Mutations =======================================

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: consultationsService.createConsultation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      // If a new consultation also implies a new patient, invalidate patients too
      // queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("New consultation created!");
    },
    onError: (error) => {
      console.error("Error creating consultation:", error);
      toast.error(`Consultation creation failed: ${error.message || "Unknown error"}`);
    },
  });
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consultationId, updateData }) =>
      consultationsService.updateConsultation(consultationId, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["consultation", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["consultations", "patient", data.patientId] });
      toast.success("Consultation updated!");
    },
    onError: (error) => {
      console.error("Error updating consultation:", error);
      toast.error(`Consultation update failed: ${error.message || "Unknown error"}`);
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultationId) => consultationsService.deleteConsultation(consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      // Potentially invalidate individual consultation or patient's consultations if needed
      toast.success("Consultation deleted!");
    },
    onError: (error) => {
      console.error("Error deleting consultation:", error);
      toast.error(`Consultation deletion failed: ${error.message || "Unknown error"}`);
    },
  });
}

// --- Patient Hooks ---

