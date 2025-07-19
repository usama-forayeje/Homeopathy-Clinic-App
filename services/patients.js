import { databases, DATABASE_ID, COLLECTIONS, Query } from "@/lib/appwrite"
import { ID } from "appwrite"

export const patientService = {
  // Create a new patient
  async createPatient(patientData) {
    try {
      const response = await databases.createDocument(DATABASE_ID, COLLECTIONS.PATIENTS, ID.unique(), {
        name: patientData.name,
        gender: patientData.gender,
        age: patientData.age,
        dob: patientData.dob || null,
        address: patientData.address || "",
        phoneNumber: patientData.phoneNumber,
        occupation: patientData.occupation || "",
        lastVisitDate: new Date().toISOString(),
      })
      return response
    } catch (error) {
      console.error("Error creating patient:", error)
      throw error
    }
  },

  // Get all patients with pagination
  async getPatients(limit = 25, offset = 0, searchTerm = "") {
    try {
      const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc("$createdAt")]

      if (searchTerm) {
        queries.push(Query.search("name", searchTerm))
      }

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PATIENTS, queries)
      return response
    } catch (error) {
      console.error("Error fetching patients:", error)
      throw error
    }
  },

  // Get a single patient by ID
  async getPatient(patientId) {
    try {
      const response = await databases.getDocument(DATABASE_ID, COLLECTIONS.PATIENTS, patientId)
      return response
    } catch (error) {
      console.error("Error fetching patient:", error)
      throw error
    }
  },

  // Update patient information
  async updatePatient(patientId, updateData) {
    try {
      const response = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PATIENTS, patientId, updateData)
      return response
    } catch (error) {
      console.error("Error updating patient:", error)
      throw error
    }
  },

  // Delete a patient
  async deletePatient(patientId) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PATIENTS, patientId)
      return true
    } catch (error) {
      console.error("Error deleting patient:", error)
      throw error
    }
  },

  // Search patients by phone number
  async searchPatientByPhone(phoneNumber) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PATIENTS, [
        Query.equal("phoneNumber", phoneNumber),
      ])
      return response.documents[0] || null
    } catch (error) {
      console.error("Error searching patient by phone:", error)
      throw error
    }
  },

  // Get recent patients
  async getRecentPatients(limit = 10) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PATIENTS, [
        Query.limit(limit),
        Query.orderDesc("lastVisitDate"),
      ])
      return response
    } catch (error) {
      console.error("Error fetching recent patients:", error)
      throw error
    }
  },
}
