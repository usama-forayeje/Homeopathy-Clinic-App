/**
 * ID Generation Utilities
 *
 * This module provides utilities for generating unique IDs
 * for patients and other entities in the system.
 */

/**
 * Generate a unique patient ID
 *
 * Format: P + timestamp + random string
 * Example: P1K2M3N4O5P6
 *
 * @returns {string} Unique patient ID
 */
export function generatePatientId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  const patientId = `P${timestamp}${random}`

  console.log("🆔 Generated new patient ID:", patientId)
  return patientId
}

/**
 * Generate a unique serial number
 *
 * Format: S + date + sequence
 * Example: S20250131001
 *
 * @returns {string} Unique serial number
 */
export function generateSerialNumber() {
  const today = new Date()
  const dateString = today.toISOString().slice(0, 10).replace(/-/g, "")
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const serialNumber = `S${dateString}${sequence}`

  console.log("📋 Generated new serial number:", serialNumber)
  return serialNumber
}

/**
 * Validate patient ID format
 *
 * @param {string} patientId - Patient ID to validate
 * @returns {boolean} Whether the ID is valid
 */
export function validatePatientId(patientId) {
  if (!patientId || typeof patientId !== "string") return false

  // Should start with P and be at least 8 characters
  const isValid = /^P[A-Z0-9]{7,}$/.test(patientId)

  console.log(`🔍 Validating patient ID "${patientId}":`, isValid ? "✅ Valid" : "❌ Invalid")
  return isValid
}
