"use client"

import { create } from "zustand"
import { chamberService } from "@/services/chambers"

export const useChamberStore = create((set, get) => ({
  activeChamber: null,
  chambers: [],
  isLoadingChambers: false,
  chambersLoaded: false,
  error: null,

  setChambers: (chambersData) => {
    set({
      chambers: chambersData,
      isLoadingChambers: false,
      chambersLoaded: true,
      error: null,
    })
  },

  setActiveChamberById: (chamberId) => {
    const allChambers = get().chambers
    const foundChamber = allChambers.find((chamber) => chamber.$id === chamberId)
    if (foundChamber) {
      set({ activeChamber: foundChamber })
      // Store in localStorage for persistence
      localStorage.setItem("activeChamber", JSON.stringify(foundChamber))
    }
  },

  fetchChambers: async () => {
    set({ isLoadingChambers: true, error: null })
    try {
      const data = await chamberService.getAllChambers()
      set({
        chambers: data,
        isLoadingChambers: false,
        chambersLoaded: true,
        error: null,
      })

      // Set first chamber as active if no active chamber is set
      const currentActive = get().activeChamber
      if (!currentActive && data.length > 0) {
        get().setActiveChamberById(data[0].$id)
      }
    } catch (error) {
      console.error("Error fetching chambers:", error)
      set({
        error: error.message,
        isLoadingChambers: false,
        chambersLoaded: false,
      })
    }
  },

  setActiveChamber: (chamber) => {
    set({ activeChamber: chamber })
    if (chamber) {
      localStorage.setItem("activeChamber", JSON.stringify(chamber))
    }
  },

  setLoadingChambers: (loading) => set({ isLoadingChambers: loading }),

  // Initialize from localStorage
  initializeFromStorage: () => {
    try {
      const storedChamber = localStorage.getItem("activeChamber")
      if (storedChamber) {
        const chamber = JSON.parse(storedChamber)
        set({ activeChamber: chamber })
      }
    } catch (error) {
      console.error("Error loading chamber from storage:", error)
    }
  },

  clearError: () => set({ error: null }),
}))
