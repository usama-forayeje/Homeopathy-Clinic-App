import { create } from 'zustand';

export const useInstructionStore = create((set) => ({
    instructions: [],
    isLoadingInstructions: true,
    instructionError: null,

    setInstructions: (instructionsData) => set({ instructions: instructionsData, isLoadingInstructions: false, instructionError: null }),
    setLoadingInstructions: (loading) => set({ isLoadingInstructions: loading }),
    setInstructionError: (error) => set({ instructionError: error, isLoadingInstructions: false }),
}));