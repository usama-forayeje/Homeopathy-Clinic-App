import { medicineInstructionsService } from "@/services/medicineInstructions";
import { create } from "zustand"

export const useInstructionStore = create((set) => ({
  instructions: [],
  loadingInstructions: false,
  instructionError: null,

  setInstructions: (instructions) => set({ instructions }),
  setLoadingInstructions: (loading) => set({ loadingInstructions: loading }),
  setInstructionError: (error) => set({ instructionError: error }),

  fetchInstructions: async () => {
    set({ loadingInstructions: true, instructionError: null });
    try {
      const data = await medicineInstructionsService.getAllInstructions();
      set({ instructions: data, loadingInstructions: false });
    } catch (error) {
      console.error("Failed to fetch instructions:", error);
      set({ instructionError: error, loadingInstructions: false });
    }
  },

  addInstruction: (instruction) =>
    set((state) => ({
      instructions: [...state.instructions, instruction],
    })),

  updateInstruction: (id, updatedInstruction) =>
    set((state) => ({
      instructions: state.instructions.map((instruction) =>
        instruction.$id === id ? { ...instruction, ...updatedInstruction } : instruction,
      ),
    })),

  removeInstruction: (id) =>
    set((state) => ({
      instructions: state.instructions.filter((instruction) => instruction.$id !== id),
    })),
}))
