"use client"

import { useState, useEffect, useRef } from "react"

export function useFormTabCompletion(form) {
  const { watch } = form
  const [completedTabs, setCompletedTabs] = useState(new Set())

  // Using useRef to store the previous set of completed tabs for comparison without triggering effect
  const prevCompletedTabs = useRef(new Set())

  const patientDetailsName = watch("patientDetails.name")
  const patientDetailsAge = watch("patientDetails.age")
  const patientDetailsPhoneNumber = watch("patientDetails.phoneNumber")
  const consultationDetailsDate = watch("consultationDetails.consultationDate")
  const consultationDetailsChamberId = watch("consultationDetails.chamberId")
  const consultationDetailsChiefComplaint = watch("consultationDetails.chiefComplaint")
  const consultationDetailsDiagnosis = watch("consultationDetails.diagnosis")

  useEffect(() => {
    const currentCalculatedTabs = new Set()

    if (patientDetailsName && patientDetailsAge && patientDetailsPhoneNumber) {
      currentCalculatedTabs.add("patient")
    }

    if (
      consultationDetailsDate &&
      consultationDetailsChamberId &&
      // Ensure chiefComplaint is not just an empty array of empty strings
      consultationDetailsChiefComplaint &&
      consultationDetailsChiefComplaint.some((c) => c && c.trim()) &&
      // Ensure diagnosis is not just an empty array of empty strings
      consultationDetailsDiagnosis &&
      consultationDetailsDiagnosis.some((d) => d && d.trim())
    ) {
      currentCalculatedTabs.add("consultation")
    }

    // These tabs are currently always considered complete for now.
    // You might add more specific validation here if needed in the future.
    currentCalculatedTabs.add("prescription")
    currentCalculatedTabs.add("habits")

    // Compare the new set with the previous set to avoid unnecessary updates
    const prevArray = Array.from(prevCompletedTabs.current).sort()
    const currentArray = Array.from(currentCalculatedTabs).sort()

    // Only update state if the set of completed tabs has actually changed
    if (JSON.stringify(prevArray) !== JSON.stringify(currentArray)) {
      setCompletedTabs(currentCalculatedTabs)
      // Update the ref to the new set for the next comparison
      prevCompletedTabs.current = currentCalculatedTabs
    }
  }, [
    // Dependencies: only the form field values that determine tab completion
    patientDetailsName,
    patientDetailsAge,
    patientDetailsPhoneNumber,
    consultationDetailsDate,
    consultationDetailsChamberId,
    consultationDetailsChiefComplaint,
    consultationDetailsDiagnosis,
  ]) // IMPORTANT: 'completedTabs' removed from dependencies

  return { completedTabs }
}
