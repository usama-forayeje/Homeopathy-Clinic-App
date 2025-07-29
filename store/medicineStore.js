import { medicineService } from "@/services/medicines";
import { create } from "zustand"

export const useMedicineStore = create((set) => ({
  medicines: [],
  loadingMedicines: false,
  medicineError: null,

  setMedicines: (medicines) => set({ medicines }),
  setLoadingMedicines: (loading) => set({ loadingMedicines: loading }),
  setMedicineError: (error) => set({ medicineError: error }),

  fetchMedicines: async () => {
    set({ loadingMedicines: true, medicineError: null });
    try {
      const data = await medicineService.getAllMedicines();
      set({ medicines: data, loadingMedicines: false });
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
      set({ medicineError: error, loadingMedicines: false });
    }
  },

  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [...state.medicines, medicine],
    })),

  updateMedicine: (id, updatedMedicine) =>
    set((state) => ({
      medicines: state.medicines.map((medicine) =>
        medicine.$id === id ? { ...medicine, ...updatedMedicine } : medicine,
      ),
    })),

  removeMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((medicine) => medicine.$id !== id),
    })),
}))
