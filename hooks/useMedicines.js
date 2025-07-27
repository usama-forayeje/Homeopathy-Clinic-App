import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { medicineService } from '@/services/medicines';

// --- Query Hooks for Medicines ---

export function useMedicine(medicineId) {
  return useQuery({
    queryKey: ['medicine', medicineId],
    queryFn: () => medicineService.getMedicineById(medicineId),
    enabled: !!medicineId,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error(`Failed to fetch medicine ${medicineId}:`, error);
      toast.error(`Failed to load medicine: ${error.message}`);
    },
  });
}

export function useSearchMedicines(searchTerm) {
  return useQuery({
    queryKey: ['medicines', 'search', searchTerm],
    queryFn: () => medicineService.searchMedicines(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 1000 * 30, // Data considered fresh for 30 seconds
    onError: (error) => {
      console.error(`Failed to search medicines for "${searchTerm}":`, error);
      toast.error(`Failed to search medicines: ${error.message}`);
    },
  });
}

export function useAllMedicines() {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: medicineService.getAllMedicines,
    staleTime: 1000 * 60 * 30, // Data considered fresh for 30 minutes
    onError: (error) => {
      console.error('Failed to fetch all medicines:', error);
      toast.error(`Failed to load all medicines: ${error.message}`);
    },
  });
}

// --- Mutation Hooks for Medicines ---

export function useMedicinesMutations() {
  const queryClient = useQueryClient();

  const createMedicineMutation = useMutation({
    mutationFn: medicineService.createMedicine,
    onSuccess: (newMedicine) => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'search'] });
      toast.success(`Medicine "${newMedicine.medicineName}" created successfully!`);
    },
    onError: (error) => {
      console.error("Failed to create medicine:", error);
      const errorMessage = error.message.includes("A medicine with this name already exists")
        ? error.message
        : `Failed to create medicine: ${error.message}`;
      toast.error(errorMessage);
    },
  });

  const updateMedicineMutation = useMutation({
    mutationFn: ({ medicineId, data }) => medicineService.updateMedicine(medicineId, data),
    onSuccess: (updatedMedicine) => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicine', updatedMedicine.$id] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'search'] });
      toast.success(`Medicine "${updatedMedicine.medicineName}" updated successfully!`);
    },
    onError: (error) => {
      console.error("Failed to update medicine:", error);
      toast.error(`Failed to update medicine: ${error.message}`);
    },
  });

  const deleteMedicineMutation = useMutation({
    mutationFn: medicineService.deleteMedicine,
    onSuccess: (_, medicineId) => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicine', medicineId] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'search'] });
      toast.success('Medicine deleted successfully!');
    },
    onError: (error) => {
      console.error("Failed to delete medicine:", error);
      toast.error(`Failed to delete medicine: ${error.message}`);
    },
  });

  return { createMedicineMutation, updateMedicineMutation, deleteMedicineMutation };
}