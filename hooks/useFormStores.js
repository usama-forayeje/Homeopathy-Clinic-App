"use client"

import { useEffect } from "react"
import { useChamberStore } from "@/store/chamberStore"
import { useInstructionStore } from "@/store/instructionStore"
import { useMedicineStore } from "@/store/medicineStore"
import { useHabitDefinitionStore } from "@/store/useHabitDefinitionStore"

export function useFormStores() {
  const { habitDefinitions, loadingHabitDefinitions, fetchHabitDefinitions } = useHabitDefinitionStore()
  const { medicines, loadingMedicines, fetchMedicines } = useMedicineStore()
  const { instructions, loadingInstructions, fetchInstructions } = useInstructionStore()
  const { chambers, isLoadingChambers, fetchChambers } = useChamberStore()

  useEffect(() => {
    if (chambers.length === 0 && !isLoadingChambers) fetchChambers()
    if (instructions.length === 0 && !loadingInstructions) fetchInstructions()
    if (medicines.length === 0 && !loadingMedicines) fetchMedicines()
    if (habitDefinitions.length === 0 && !loadingHabitDefinitions) fetchHabitDefinitions()
  }, [
    chambers.length,
    isLoadingChambers,
    fetchChambers,
    instructions.length,
    loadingInstructions,
    fetchInstructions,
    medicines.length,
    loadingMedicines,
    fetchMedicines,
    habitDefinitions.length,
    loadingHabitDefinitions,
    fetchHabitDefinitions,
  ])

  const isFormLoading = loadingHabitDefinitions || loadingMedicines || loadingInstructions || isLoadingChambers

  return {
    habitDefinitions,
    medicines,
    instructions,
    chambers,
    isFormLoading,
  }
}
