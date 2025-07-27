import { create } from 'zustand';

export const useChamberStore = create((set, get) => ({
    activeChamber: null,
    chambers: [],
    isLoadingChambers: true,
    chambersLoaded: false,

    setChambers: (chambersData) => {
        set({
            chambers: chambersData,
            isLoadingChambers: false,
            chambersLoaded: true
        });
    },

    setActiveChamberById: (chamberId) => {
        const allChambers = get().chambers;
        const foundChamber = allChambers.find(chamber => chamber.$id === chamberId);
        if (foundChamber) {
            set({ activeChamber: foundChamber });
        }
    },

    setActiveChamber: (chamber) => set({ activeChamber: chamber }),

    setLoadingChambers: (loading) => set({ isLoadingChambers: loading }),
}));