import { create } from "zustand";
import habitDefinitionsService from '@/services/habitDefinitions';

export const useHabitDefinitionStore = create((set) => ({
  habitDefinitions: [],
  loadingHabitDefinitions: false,
  habitDefinitionError: null,
  habitDefinitionsMap: {},

  setHabitDefinitions: (definitions) => {
    const map = definitions.reduce((acc, def) => {
      acc[def.$id] = def;
      return acc;
    }, {});
    set({ habitDefinitions: definitions, habitDefinitionsMap: map });
  },
  setLoadingHabitDefinitions: (loading) => set({ loadingHabitDefinitions: loading }),
  setHabitDefinitionError: (error) => set({ habitDefinitionError: error }),

  fetchHabitDefinitions: async () => {
    set({ loadingHabitDefinitions: true, habitDefinitionError: null });
    try {
      const data = await habitDefinitionsService.getAllActiveHabitDefinitions();
      set((state) => {
        const map = data.reduce((acc, def) => {
          acc[def.$id] = def;
          return acc;
        }, {});
        return {
          habitDefinitions: data,
          habitDefinitionsMap: map,
          loadingHabitDefinitions: false,
        };
      });
    } catch (error) {
      set({ habitDefinitionError: error, loadingHabitDefinitions: false });
    }
  },
}));