"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import patientConsultationsService from "@/services/patientConsultations"

// ========================================== Query Keys Factory ==========================================
export const consultationKeys = {
  all: ["consultations"],
  lists: () => [...consultationKeys.all, "list"],
  list: (filters) => [...consultationKeys.lists(), { filters }],
  details: () => [...consultationKeys.all, "detail"],
  detail: (id) => [...consultationKeys.details(), id],
  patient: (patientId) => [...consultationKeys.all, "patient", patientId],
  today: () => [...consultationKeys.all, "today"],
  upcoming: () => [...consultationKeys.all, "upcoming"],
  analytics: () => [...consultationKeys.all, "analytics"],
}

export function useConsultation(consultationId, options = {}) {
  return useQuery({
    queryKey: consultationKeys.detail(consultationId),
    queryFn: () => patientConsultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error?.status === 404) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

/**
 * Get all consultations for a specific patient
 */
export function usePatientConsultations(patientId, options = {}) {
  return useQuery({
    queryKey: consultationKeys.patient(patientId),
    queryFn: () => patientConsultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    ...options,
  })
}

/**
 * Get all consultations with pagination and filtering
 */
export function useConsultations(filters = {}, options = {}) {
  return useQuery({
    queryKey: consultationKeys.list(filters),
    queryFn: () => patientConsultationsService.getAllConsultations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Get today's consultations with real-time updates
 */
export function useTodayConsultations(options = {}) {
  return useQuery({
    queryKey: consultationKeys.today(),
    queryFn: () => patientConsultationsService.getTodayConsultations(),
    staleTime: 1 * 60 * 1000, // 1 minute for real-time feel
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    ...options,
  })
}

// ========================================== Mutation Hooks ==========================================
/**
 * Create new patient with first consultation - Enhanced with optimistic updates
 */
export function useCreatePatientConsultation(options = {}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  return useMutation({
    mutationFn: async (data) => {
      setProgress(10)

      // Validate data before sending
      await patientConsultationsService.validateConsultationData(data)
      setProgress(30)

      // Create patient and consultation
      const result = await patientConsultationsService.createPatientAndFirstConsultation(data)
      setProgress(100)

      return result
    },

    onMutate: async (newData) => {
      setProgress(5)

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: consultationKeys.all })

      // Snapshot the previous value for rollback
      const previousConsultations = queryClient.getQueryData(consultationKeys.lists())

      return { previousConsultations }
    },

    onSuccess: (data, variables, context) => {
      setProgress(100)

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: consultationKeys.all })
      queryClient.invalidateQueries({ queryKey: consultationKeys.today() })

      // Set the new consultation data in cache
      queryClient.setQueryData(consultationKeys.detail(data.newConsultation.$id), data.newConsultation)

      // Success feedback
      toast.success("🎉 Patient and consultation created successfully!", {
        description: `Patient ${data.newPatient.name} has been registered`,
        duration: 5000,
        action: {
          label: "View",
          onClick: () => router.push(`/dashboard/consultations/${data.newConsultation.$id}`),
        },
      })

      // Custom success callback
      options.onSuccess?.(data, variables, context)

      // Auto-navigate after short delay
      setTimeout(() => {
        router.push(`/dashboard/consultations/${data.newConsultation.$id}`)
      }, 1500)
    },

    onError: (error, variables, context) => {
      setProgress(0)

      // Rollback optimistic updates
      if (context?.previousConsultations) {
        queryClient.setQueryData(consultationKeys.lists(), context.previousConsultations)
      }

      // Enhanced error handling
      const errorMessage = patientConsultationsService.getErrorMessage(error)

      toast.error("❌ Failed to create patient", {
        description: errorMessage,
        duration: 7000,
        action: {
          label: "Retry",
          onClick: () => {
            // Retry logic could be implemented here
          },
        },
      })

      // Custom error callback
      options.onError?.(error, variables, context)
    },

    onSettled: () => {
      setProgress(0)
      options.onSettled?.()
    },
  })
}

/**
 * Update existing consultation with optimistic updates
 */
export function useUpdateConsultation(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ consultationId, updateData }) =>
      patientConsultationsService.updateConsultation(consultationId, updateData),

    onMutate: async ({ consultationId, updateData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: consultationKeys.detail(consultationId) })

      // Snapshot previous value
      const previousConsultation = queryClient.getQueryData(consultationKeys.detail(consultationId))

      // Optimistically update
      queryClient.setQueryData(consultationKeys.detail(consultationId), (old) => ({
        ...old,
        ...updateData.consultationDetails,
        $updatedAt: new Date().toISOString(),
      }))

      return { previousConsultation, consultationId }
    },

    onSuccess: (data, { consultationId }) => {
      // Update cache with server data
      queryClient.setQueryData(consultationKeys.detail(consultationId), data)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: consultationKeys.patient(data.patientId) })
      queryClient.invalidateQueries({ queryKey: consultationKeys.lists() })

      toast.success("✅ Consultation updated successfully!")
      options.onSuccess?.(data)
    },

    onError: (error, { consultationId }, context) => {
      // Rollback optimistic update
      if (context?.previousConsultation) {
        queryClient.setQueryData(consultationKeys.detail(consultationId), context.previousConsultation)
      }

      const errorMessage = patientConsultationsService.getErrorMessage(error)
      toast.error(`❌ Failed to update consultation: ${errorMessage}`)
      options.onError?.(error)
    },
  })
}

/**
 * Delete consultation with confirmation
 */
export function useDeleteConsultation(options = {}) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: patientConsultationsService.deleteConsultation,

    onMutate: async (consultationId) => {
      // Get consultation data for rollback
      const consultation = queryClient.getQueryData(consultationKeys.detail(consultationId))

      // Optimistically remove from lists
      queryClient.setQueryData(
        consultationKeys.lists(),
        (old) => old?.filter((item) => item.$id !== consultationId) || [],
      )

      return { consultation, consultationId }
    },

    onSuccess: (data, consultationId, context) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: consultationKeys.detail(consultationId) })

      // Invalidate related queries
      if (context?.consultation?.patientId) {
        queryClient.invalidateQueries({
          queryKey: consultationKeys.patient(context.consultation.patientId),
        })
      }
      queryClient.invalidateQueries({ queryKey: consultationKeys.all })

      toast.success("🗑️ Consultation deleted successfully")

      // Navigate away if we're on the deleted consultation page
      if (window.location.pathname.includes(consultationId)) {
        router.push("/dashboard/consultations")
      }

      options.onSuccess?.(data, consultationId, context)
    },

    onError: (error, consultationId, context) => {
      // Rollback optimistic deletion
      if (context?.consultation) {
        queryClient.setQueryData(consultationKeys.lists(), (old) => [...(old || []), context.consultation])
      }

      const errorMessage = patientConsultationsService.getErrorMessage(error)
      toast.error(`❌ Failed to delete consultation: ${errorMessage}`)
      options.onError?.(error, consultationId, context)
    },
  })
}

export function useConsultationForm(defaultData = null, options = {}) {
  const createMutation = useCreatePatientConsultation()
  const updateMutation = useUpdateConsultation()

  const isEditing = !!defaultData?.$id
  const mutation = isEditing ? updateMutation : createMutation

  const handleSubmit = useCallback(
    async (formData) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({
            consultationId: defaultData.$id,
            updateData: formData,
          })
        } else {
          await createMutation.mutateAsync(formData)
        }
      } catch (error) {
        // Error handling is done in the mutation hooks
        throw error
      }
    },
    [isEditing, defaultData?.$id, createMutation, updateMutation],
  )

  return {
    handleSubmit,
    isLoading: mutation.isPending,
    isEditing,
    error: mutation.error,
    progress: createMutation.progress || 0,
    reset: mutation.reset,
  }
}
