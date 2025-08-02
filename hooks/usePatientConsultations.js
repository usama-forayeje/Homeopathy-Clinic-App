"use client"

import patientConsultationsService from "@/services/patientConsultations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// ========================================== Core Consultation Hooks =======================================

export function useConsultation(consultationId) {
  return useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => patientConsultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePatientConsultations(patientId) {
  return useQuery({
    queryKey: ["consultations", "patient", patientId],
    queryFn: () => patientConsultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTodayConsultations() {
  return useQuery({
    queryKey: ["consultations", "today"],
    queryFn: () => patientConsultationsService.getTodayConsultations(), // Assuming this exists in your service
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// ========================================== Patient Consultation Mutations =======================================

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

export const useConsultationForm = () => {
  const queryClient = useQueryClient();

  const createCombinedMutation = useMutation({
    mutationFn: async (fullFormData) => { // এখানে fullFormData আসবে (patientDetails, consultationDetails, prescription, habitsAndHistory)
      console.log("useConsultationForm: Combined mutation শুরু হচ্ছে, ডেটা:", fullFormData);
      return await patientConsultationsService.createPatientAndFirstConsultation(fullFormData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['consultations']);
      // যদি habits collection থাকে, তাহলে সেটিও invalidate করুন
      queryClient.invalidateQueries(['patientHabits']);
      toast.success("নতুন রোগী এবং কনসালটেশন সফলভাবে তৈরি হয়েছে!");
      console.log("useConsultationForm: Combined mutation সফল:", data);
    },
    onError: (error) => {
      console.error("useConsultationForm: Combined mutation এ ত্রুটি:", error);
      toast.error(error.message || "রোগী এবং কনসালটেশন তৈরি করতে ব্যর্থ হয়েছে।");
    },
  });

  return {
    createCombinedMutation,
    isSubmittingCombined: createCombinedMutation.isPending,
    combinedStatus: createCombinedMutation.status,
  };
};

export const useCreateConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultationData) => {
      console.log("useCreateConsultation: কনসালটেশন তৈরি শুরু হচ্ছে:", consultationData);
      return await patientConsultationsService.createConsultation(consultationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['consultations']);
      // যদি এই কনসালটেশনে habits যোগ হয়, তাহলে habits query invalidate করুন
      queryClient.invalidateQueries(['patientHabits']);
      toast.success("বিদ্যমান রোগীর জন্য নতুন কনসালটেশন যোগ করা হয়েছে!");
    },
    onError: (error) => {
      console.error("useCreateConsultation: বিদ্যমান রোগীর জন্য কনসালটেশন তৈরিতে ত্রুটি:", error);
      toast.error(error.message || "বিদ্যমান রোগীর জন্য নতুন কনসালটেশন যোগ করতে ব্যর্থ হয়েছে।");
    }
  });
};

export const useGetConsultation = (consultationId) => {
  return useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: () => patientConsultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
  });
};

export const useGetPatientConsultations = (patientId) => {
  return useQuery({
    queryKey: ['patientConsultations', patientId],
    queryFn: () => patientConsultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
  });
};

export const useGetAllConsultations = (filters = {}) => {
  return useQuery({
    queryKey: ['allConsultations', filters],
    queryFn: () => patientConsultationsService.getAllConsultations(filters),
  });
};

export const useGetTodayConsultations = () => {
  return useQuery({
    queryKey: ['todayConsultations'],
    queryFn: patientConsultationsService.getTodayConsultations,
    refetchInterval: 5 * 60 * 1000,
  });
};