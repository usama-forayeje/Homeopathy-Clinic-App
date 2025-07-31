"use client"

import { useEffect, useState } from "react"

export function useFormTabCompletion(form) {
  const [completedTabs, setCompletedTabs] = useState(new Set())

  // Watch specific fields for enhanced tab completion
  const patientDetailsName = form.watch("patientDetails.name")
  const patientDetailsAge = form.watch("patientDetails.age")
  const patientDetailsPhoneNumber = form.watch("patientDetails.phoneNumber")
  const consultationDetailsDate = form.watch("consultationDetails.consultationDate")
  const consultationDetailsChamberId = form.watch("consultationDetails.chamberId")
  const consultationDetailsChiefComplaint = form.watch("consultationDetails.chiefComplaint")
  const consultationDetailsDiagnosis = form.watch("consultationDetails.diagnosis")

  // Enhanced tab completion logic
  useEffect(() => {
    const newCompletedTabs = new Set()

    // Patient tab validation
    if (patientDetailsName?.trim() && patientDetailsAge > 0 && patientDetailsPhoneNumber?.trim()) {
      newCompletedTabs.add("patient")
    }

    // Consultation tab validation
    if (
      consultationDetailsDate &&
      consultationDetailsChamberId &&
      consultationDetailsChiefComplaint?.some((c) => c?.trim()) &&
      consultationDetailsDiagnosis?.some((d) => d?.trim())
    ) {
      newCompletedTabs.add("consultation")
    }

    // Prescription and habits are optional
    newCompletedTabs.add("prescription")
    newCompletedTabs.add("habits")

    setCompletedTabs(newCompletedTabs)
  }, [
    patientDetailsName,
    patientDetailsAge,
    patientDetailsPhoneNumber,
    consultationDetailsDate,
    consultationDetailsChamberId,
    consultationDetailsChiefComplaint,
    consultationDetailsDiagnosis,
  ])

  return { completedTabs }
}
