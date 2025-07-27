import { medicineInstructionsService } from '@/services/medicineInstructions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// --- Query Hooks for Medicine Instructions ---

export function useAllMedicineInstructions() {
  return useQuery({
    queryKey: ['medicineInstructions'],
    queryFn: medicineInstructionsService.getAllInstructions,
    staleTime: 1000 * 60 * 10, // Data considered fresh for 10 minutes
    onError: (error) => {
      console.error('Failed to fetch all medicine instructions:', error);
      toast.error(`Failed to load instructions: ${error.message}`);
    },
  });
}

export function useSearchMedicineInstructions(searchTerm) {
  return useQuery({
    queryKey: ['medicineInstructions', 'search', searchTerm],
    queryFn: () => medicineInstructionsService.searchInstructions(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 1000 * 30,
    onError: (error) => {
      console.error(`Failed to search instructions for "${searchTerm}":`, error);
      toast.error(`Failed to search instructions: ${error.message}`);
    },
  });
}

export function useMedicineInstruction(instructionId) {
  return useQuery({
    queryKey: ['medicineInstruction', instructionId],
    queryFn: () => medicineInstructionsService.getInstructionById(instructionId),
    enabled: !!instructionId,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error(`Failed to fetch instruction ${instructionId}:`, error);
      toast.error(`Failed to load instruction: ${error.message}`);
    },
  });
}

// --- Mutation Hooks for Medicine Instructions ---

export function useMedicineInstructionMutations() {
  const queryClient = useQueryClient();

  const createMedicineInstructionMutation = useMutation({
    mutationFn: medicineInstructionsService.createInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions'] }); // Invalidate all instructions list
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions', 'search'] }); // Invalidate search results
      toast.success('Instruction created successfully!');
    },
    onError: (error) => {
      console.error("Failed to create instruction:", error);
      const errorMessage = error.message.includes("This instruction already exists.")
        ? error.message
        : `Failed to create instruction: ${error.message}`;
      toast.error(errorMessage);
    },
  });

  const updateMedicineInstructionMutation = useMutation({
    mutationFn: ({ instructionId, data }) => medicineInstructionsService.updateInstruction(instructionId, data),
    onSuccess: (updatedInstruction) => {
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions'] }); // Invalidate all instructions list
      queryClient.invalidateQueries({ queryKey: ['medicineInstruction', updatedInstruction.$id] }); // Invalidate specific instruction
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions', 'search'] }); // Invalidate search results
      toast.success('Instruction updated successfully!');
    },
    onError: (error) => {
      console.error("Failed to update instruction:", error);
      toast.error(`Failed to update instruction: ${error.message}`);
    },
  });

  const deleteMedicineInstructionMutation = useMutation({
    mutationFn: medicineInstructionsService.deleteInstruction,
    onSuccess: (_, instructionId) => { // Access the instructionId from the mutation variables
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions'] }); // Invalidate all instructions list
      queryClient.invalidateQueries({ queryKey: ['medicineInstruction', instructionId] }); // Invalidate specific instruction from cache
      queryClient.invalidateQueries({ queryKey: ['medicineInstructions', 'search'] }); // Invalidate search results
      toast.success('Instruction deleted successfully!');
    },
    onError: (error) => {
      console.error("Failed to delete instruction:", error);
      toast.error(`Failed to delete instruction: ${error.message}`);
    },
  });

  return {
    createMedicineInstructionMutation,
    updateMedicineInstructionMutation,
    deleteMedicineInstructionMutation,
  };
}