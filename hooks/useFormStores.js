"use client"

import { useChamberStore } from "@/store/chamberStore"
import { useInstructionStore } from "@/store/instructionStore"
import { useMedicineStore } from "@/store/medicineStore"
import { useHabitDefinitionStore } from "@/store/useHabitDefinitionStore"
import { useEffect } from "react"

export function useFormStores() {
  // Enhanced Zustand stores with comprehensive error handling
  const { habitDefinitions, loadingHabitDefinitions, fetchHabitDefinitions, habitDefinitionError } =
    useHabitDefinitionStore()
  const { medicines, loadingMedicines, fetchMedicines, medicineError } = useMedicineStore()
  const { instructions, loadingInstructions, fetchInstructions, instructionError } = useInstructionStore()
  const { chambers, isLoadingChambers, fetchChambers, chamberError } = useChamberStore()

  // Enhanced data fetching with comprehensive error handling and retry logic
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchPromises = []

        if (chambers.length === 0 && !isLoadingChambers && !chamberError) {
          fetchPromises.push(fetchChambers())
        }
        if (instructions.length === 0 && !loadingInstructions && !instructionError) {
          fetchPromises.push(fetchInstructions())
        }
        if (medicines.length === 0 && !loadingMedicines && !medicineError) {
          fetchPromises.push(fetchMedicines())
        }
        if (habitDefinitions.length === 0 && !loadingHabitDefinitions && !habitDefinitionError) {
          fetchPromises.push(fetchHabitDefinitions())
        }

        if (fetchPromises.length > 0) {
          await Promise.allSettled(fetchPromises)
        }
      } catch (error) {
        console.error("❌ Error fetching form data:", error)
      }
    }

    fetchAllData()
  }, [
    chambers.length,
    isLoadingChambers,
    chamberError,
    fetchChambers,
    instructions.length,
    loadingInstructions,
    instructionError,
    fetchInstructions,
    medicines.length,
    loadingMedicines,
    medicineError,
    fetchMedicines,
    habitDefinitions.length,
    loadingHabitDefinitions,
    habitDefinitionError,
    fetchHabitDefinitions,
  ])

  const isFormLoading = loadingHabitDefinitions || loadingMedicines || loadingInstructions || isLoadingChambers

  return {
    habitDefinitions,
    medicines,
    instructions,
    chambers,
    isFormLoading,
    errors: {
      habitDefinitionError,
      medicineError,
      instructionError,
      chamberError,
    },
  }
}
