import { chamberService } from "@/services/chambers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// --- Query Hooks for Chambers ---

export function useAllChambers() {
    return useQuery({
        queryKey: ["chambers"],
        queryFn: chamberService.getAllChambers,
        staleTime: 1000 * 60 * 30, // Chambers data might not change often
        onError: (error) => {
            console.error("Failed to fetch all chambers:", error);
            toast.error(`Failed to load chambers: ${error.message}`);
        },
    });
}

export function useChamber(chamberId) {
    return useQuery({
        queryKey: ["chamber", chamberId],
        queryFn: () => chamberService.getChamberById(chamberId),
        enabled: !!chamberId,
        staleTime: 1000 * 60 * 5,
        onError: (error) => {
            console.error(`Failed to fetch chamber ${chamberId}:`, error);
            toast.error(`Failed to load chamber: ${error.message}`);
        },
    });
}

// --- Mutation Hooks for Chambers ---

export function useChamberMutations() {
    const queryClient = useQueryClient();

    const createChamberMutation = useMutation({
        mutationFn: chamberService.createChamber,
        onSuccess: (newChamber) => {
            queryClient.invalidateQueries({ queryKey: ["chambers"] });
            toast.success(`Chamber "${newChamber.name}" created successfully!`);
        },
        onError: (error) => {
            console.error("Failed to create chamber:", error);
            toast.error(`Failed to create chamber: ${error.message}`);
        },
    });

    const updateChamberMutation = useMutation({
        mutationFn: ({ chamberId, data }) =>
            chamberService.updateChamber(chamberId, data),
        onSuccess: (updatedChamber) => {
            queryClient.invalidateQueries({ queryKey: ["chambers"] });
            queryClient.invalidateQueries({ queryKey: ["chamber", updatedChamber.$id] });
            toast.success(`Chamber "${updatedChamber.name}" updated successfully!`);
        },
        onError: (error) => {
            console.error("Failed to update chamber:", error);
            toast.error(`Failed to update chamber: ${error.message}`);
        },
    });

    const deleteChamberMutation = useMutation({
        mutationFn: chamberService.deleteChamber,
        onSuccess: (_, chamberId) => {
            queryClient.invalidateQueries({ queryKey: ["chambers"] });
            queryClient.invalidateQueries({ queryKey: ["chamber", chamberId] });
            toast.success("Chamber deleted successfully!");
        },
        onError: (error) => {
            console.error("Failed to delete chamber:", error);
            toast.error(`Failed to delete chamber: ${error.message}`);
        },
    });

    return { createChamberMutation, updateChamberMutation, deleteChamberMutation };
}