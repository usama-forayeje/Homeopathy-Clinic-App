"use client"

export const transformPatientDataForSubmission = (data) => {
  if (!data) {
    console.warn("No data provided for transformation.")
    return {}
  }

  const transformedData = {
    patientDetails: {
      ...data.patientDetails,
      firstConsultationDate: data.consultationDetails?.consultationDate
        ? new Date(data.consultationDetails.consultationDate).toISOString()
        : null,
      dob: data.patientDetails?.dob ? new Date(data.patientDetails.dob).toISOString() : null,
    },
    consultationDetails: {
      ...data.consultationDetails,
      consultationDate: data.consultationDetails?.consultationDate
        ? new Date(data.consultationDetails.consultationDate).toISOString()
        : null,
      followUpDate: data.consultationDetails?.followUpDate
        ? new Date(data.consultationDetails.followUpDate).toISOString()
        : null,
      chiefComplaint: (data.consultationDetails?.chiefComplaint || []).filter((c) => c && c.trim()),
      diagnosis: (data.consultationDetails?.diagnosis || []).filter((d) => d && d.trim()),
      prescriptions: (data.consultationDetails?.prescriptions || []).filter((p) => p.medicineId),
      dosageInstructions: (data.consultationDetails?.dosageInstructions || [])
        .filter((i) => i && i.trim())
        .map((instruction) => instruction.trim()),
      dietAndLifestyleAdvice: (data.consultationDetails?.dietAndLifestyleAdvice || []).filter((a) => a && a.trim()),
    },
    patientHabits: (data.patientHabits || [])
      .filter((habit) => habit.habitDefinitionId && habit.value)
      .map((habit) => ({
        ...habit,
        recordedDate: new Date().toISOString(),
      })),
  }

  return transformedData
}
