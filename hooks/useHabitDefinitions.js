import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import habitDefinitionsService from '@/services/habitDefinitions';

// --- Query Hooks for Habit Definitions ---
export function useAllHabitDefinitions(searchQuery = '') {
  return useQuery({
    queryKey: ['habitDefinitions', searchQuery], // searchQuery এখন queryKey এর অংশ
    queryFn: () => habitDefinitionsService.getAllHabitDefinitions(searchQuery), // ফাংশনে searchQuery পাঠানো হচ্ছে
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error('Failed to fetch all habit definitions:', error);
      toast.error(`Failed to load habit definitions: ${error.message}`);
    },
  });
}

export function useActiveHabitDefinitions() {
  return useQuery({
    queryKey: ['habitDefinitions', 'active'],
    queryFn: habitDefinitionsService.getAllActiveHabitDefinitions,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error('Failed to fetch active habit definitions:', error);
      toast.error(`Failed to load active habit definitions: ${error.message}`);
    },
  });
}

export function useHabitDefinition(definitionId) {
  return useQuery({
    queryKey: ['habitDefinition', definitionId],
    queryFn: () => habitDefinitionsService.getHabitDefinitionById(definitionId),
    enabled: !!definitionId,
    staleTime: 1000 * 60 * 2,
    onError: (error) => {
      console.error(`Failed to fetch habit definition ${definitionId}:`, error);
      toast.error(`Failed to load habit definition: ${error.message}`);
    },
  });
}

export function useHabitDefinitionMutations() {
  const queryClient = useQueryClient();

  const createHabitDefinitionMutation = useMutation({
    mutationFn: habitDefinitionsService.createHabitDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions', 'active'] });
      toast.success('Habit definition created successfully!');
    },
    onError: (error) => {
      console.error("Failed to create habit definition:", error);
      const errorMessage = error.message.includes("A habit definition with this name already exists.")
        ? error.message
        : `Failed to create habit definition: ${error.message}`;
      toast.error(errorMessage);
    },
  });

  const updateHabitDefinitionMutation = useMutation({
    mutationFn: ({ definitionId, data }) => habitDefinitionsService.updateHabitDefinition(definitionId, data),
    onSuccess: (updatedDefinition) => {
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['habitDefinition', updatedDefinition.$id] });
      toast.success('Habit definition updated successfully!');
    },
    onError: (error) => {
      console.error("Failed to update habit definition:", error);
      toast.error(`Failed to update habit definition: ${error.message}`);
    },
  });

  const deleteHabitDefinitionMutation = useMutation({
    mutationFn: habitDefinitionsService.deleteHabitDefinition,
    onSuccess: (_, definitionId) => {
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['habitDefinitions', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['habitDefinition', definitionId] });
      toast.success('Habit definition deleted successfully!');
    },
    onError: (error) => {
      console.error("Failed to delete habit definition:", error);
      toast.error(`Failed to delete habit definition: ${error.message}`);
    },
  });

  return { createHabitDefinitionMutation, updateHabitDefinitionMutation, deleteHabitDefinitionMutation };
}