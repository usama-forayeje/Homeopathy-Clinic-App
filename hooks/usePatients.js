"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientsService from '@/services/patients';
import { Query } from 'appwrite';
import { toast } from 'sonner';

// Get all patients 
export function usePatients(searchTerm = '') {
  return useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: () => {
      const queries = [];
      if (searchTerm) {
        queries.push(
          Query.or([
            Query.search('serialNumber', searchTerm),
            Query.search('name', searchTerm),
            Query.search('phoneNumber', searchTerm),
          ])
        );
      }
      return patientsService.getPatients(queries);
    },
  });
}

// Get a specific patient
export function usePatient(patientId) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientsService.getPatientById(patientId),
    enabled: !!patientId,
  });
}

// patients mutations update create delete
export function usePatientMutations() {
  const queryClient = useQueryClient();

  // patients create
  const createPatientMutation = useMutation({
    mutationFn: patientsService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('patient is created successfully!');
    },
    onError: (error) => {
      toast.error(`patient is not created: ${error.message}`);
    },
  });

  // patients update
  const updatePatientMutation = useMutation({
    mutationFn: ({ patientId, data }) => patientsService.updatePatient(patientId, data),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] }); 
      queryClient.invalidateQueries({ queryKey: ['patient', updatedPatient.$id] }); 
      toast.success('patient is updated successfully!');
    },
    onError: (error) => {
      alert(`রোগীর তথ্য আপডেট করতে ব্যর্থ: ${error.message}`);
    },
  });

  // patients delete
  const deletePatientMutation = useMutation({
    mutationFn: patientsService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] }); 
      toast.success('patient is deleted successfully!');
    },
    onError: (error) => {
      toast.error(`patient is not deleted: ${error.message}`);
    },
  });

  return { createPatientMutation, updatePatientMutation, deletePatientMutation };
}