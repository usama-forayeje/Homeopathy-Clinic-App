/**
 * Data Transformation Utilities
 *
 * This module handles the transformation of form data into the format
 * expected by the backend API and Appwrite collections.
 *
 * Key transformations:
 * 1. Date formatting to ISO strings
 * 2. ID mapping (chamber, medicine, habit definition IDs)
 * 3. Array filtering (removing empty values)
 * 4. Nested object restructuring
 */

/**
 * Transform form data for submission to the API
 *
 * @param {Object} formData - Raw form data from React Hook Form
 * @param {Object} context - Additional context data (IDs, references)
 * @returns {Object} Transformed data ready for API submission
 */
export function transformFormDataForSubmission(formData, context) {
  const { patientId, chambers, medicines, habitDefinitions } = context

  console.log("🔄 Starting data transformation...")
  console.log("📥 Input form data:", formData)
  console.log("🔗 Context data:", { patientId, chambersCount: chambers.length, medicinesCount: medicines.length })

  // ========================================== PATIENT DETAILS TRANSFORMATION ==========================================
  const transformedPatientDetails = {
    name: formData.patientDetails.name?.trim(),
    age: Number(formData.patientDetails.age) || 0,
    dob: formData.patientDetails.dob ? new Date(formData.patientDetails.dob).toISOString() : null,
    gender: formData.patientDetails.gender,
    phoneNumber: formData.patientDetails.phoneNumber?.trim(),
    address: formData.patientDetails.address?.trim() || null,
    occupation: formData.patientDetails.occupation?.trim() || null,
    patientId: patientId, // Use the generated/existing patient ID
    serialNumber: formData.patientDetails.serialNumber?.trim(), // Doctor enters this
    bloodGroup: formData.patientDetails.bloodGroup?.trim() || null,
    notes: formData.patientDetails.notes?.trim() || null,
    firstConsultationDate: new Date(formData.consultationDetails.consultationDate).toISOString(),
  }

  console.log("✅ Transformed patient details:", transformedPatientDetails)

  // ========================================== CONSULTATION DETAILS TRANSFORMATION ==========================================
  const transformedConsultationDetails = {
    consultationDate: new Date(formData.consultationDetails.consultationDate).toISOString(),
    chamberId: formData.consultationDetails.chamberId, // Selected chamber ID
    patientId: patientId, // Link to patient
    chiefComplaint: (formData.consultationDetails.chiefComplaint || [])
      .filter((complaint) => complaint?.trim())
      .map((complaint) => complaint.trim()),
    symptoms: formData.consultationDetails.symptoms?.trim() || null,
    BP: formData.consultationDetails.BP?.trim() || null,
    Pulse: formData.consultationDetails.Pulse?.trim() || null,
    Temp: formData.consultationDetails.Temp?.trim() || null,
    historyOfPresentIllness: formData.consultationDetails.historyOfPresentIllness?.trim() || null,
    familyHistory: formData.consultationDetails.familyHistory?.trim() || null,
    otherComplaints: (formData.consultationDetails.otherComplaints || [])
      .filter((complaint) => complaint?.trim())
      .map((complaint) => complaint.trim()),
    diagnosis: (formData.consultationDetails.diagnosis || [])
      .filter((diagnosis) => diagnosis?.trim())
      .map((diagnosis) => diagnosis.trim()),
    O_E: formData.consultationDetails.O_E?.trim() || null,
    // Transform prescriptions to medicine IDs
    prescriptions: transformPrescriptions(formData.consultationDetails.prescriptions, medicines),
    prescriptionNotes: formData.consultationDetails.prescriptionNotes?.trim() || null,
    dosageInstructions: (formData.consultationDetails.dosageInstructions || [])
      .filter((instruction) => instruction?.trim())
      .map((instruction) => instruction.trim()),
    dietAndLifestyleAdvice: (formData.consultationDetails.dietAndLifestyleAdvice || [])
      .filter((advice) => advice?.trim())
      .map((advice) => advice.trim()),
    followUpDate: formData.consultationDetails.followUpDate
      ? new Date(formData.consultationDetails.followUpDate).toISOString()
      : null,
    billAmount: Number(formData.consultationDetails.billAmount) || 0,
    notes: formData.consultationDetails.notes?.trim() || null,
  }

  console.log("✅ Transformed consultation details:", transformedConsultationDetails)

  // ========================================== PATIENT HABITS TRANSFORMATION ==========================================
  const transformedPatientHabits = (formData.patientHabits || [])
    .filter((habit) => habit.habitDefinitionId && habit.value?.trim())
    .map((habit) => ({
      habitDefinitionId: habit.habitDefinitionId, // Selected habit definition ID
      value: habit.value.trim(),
      patientId: patientId, // Link to patient
      consultationId: null, // Will be set after consultation is created
      notes: habit.notes?.trim() || null,
      recordedDate: new Date().toISOString(),
    }))

  console.log("✅ Transformed patient habits:", transformedPatientHabits)

  // ========================================== FINAL TRANSFORMATION ==========================================
  const finalTransformedData = {
    patientDetails: transformedPatientDetails,
    consultationDetails: transformedConsultationDetails,
    patientHabits: transformedPatientHabits,
  }

  console.log("🎉 Final transformed data:", finalTransformedData)
  return finalTransformedData
}

/**
 * Transform prescription data
 *
 * Converts prescription objects to medicine ID strings for Appwrite
 *
 * @param {Array} prescriptions - Array of prescription objects
 * @param {Array} medicines - Available medicines from store
 * @returns {Array} Array of medicine ID strings
 */
function transformPrescriptions(prescriptions, medicines) {
  if (!Array.isArray(prescriptions)) return []

  return prescriptions
    .filter((prescription) => prescription?.medicineId)
    .map((prescription) => {
      // If it's already a medicine ID string, return it
      if (typeof prescription === "string") return prescription

      // If it's an object with medicineId, extract the ID
      if (prescription.medicineId) return prescription.medicineId

      return null
    })
    .filter(Boolean)
}

/**
 * Validate transformed data before submission
 *
 * @param {Object} transformedData - Transformed data
 * @returns {Object} Validation result
 */
export function validateTransformedData(transformedData) {
  const errors = []

  // Validate patient details
  if (!transformedData.patientDetails.name) {
    errors.push("Patient name is required")
  }
  if (!transformedData.patientDetails.age || transformedData.patientDetails.age < 1) {
    errors.push("Valid patient age is required")
  }
  if (!transformedData.patientDetails.phoneNumber) {
    errors.push("Patient phone number is required")
  }

  // Validate consultation details
  if (!transformedData.consultationDetails.consultationDate) {
    errors.push("Consultation date is required")
  }
  if (!transformedData.consultationDetails.chamberId) {
    errors.push("Chamber selection is required")
  }
  if (!transformedData.consultationDetails.chiefComplaint?.length) {
    errors.push("At least one chief complaint is required")
  }
  if (!transformedData.consultationDetails.diagnosis?.length) {
    errors.push("At least one diagnosis is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
