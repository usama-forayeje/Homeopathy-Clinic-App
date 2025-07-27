import { create } from 'zustand';

export const useMedicineStore = create((set) => ({
    medicines: [],
    isLoadingMedicines: true,
    medicineError: null,

    setMedicines: (medicinesData) => set({ medicines: medicinesData, isLoadingMedicines: false, medicineError: null }),
    setLoadingMedicines: (loading) => set({ isLoadingMedicines: loading }),
    setMedicineError: (error) => set({ medicineError: error, isLoadingMedicines: false }),

    // You might add actions for adding/updating/deleting if you want to
    // directly modify the 'medicines' array in the store after a successful API call
    // For now, we'll refetch data, which is simpler for small apps.
}));