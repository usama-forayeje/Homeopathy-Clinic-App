import { databases, DATABASE_ID, COLLECTIONS, Query } from "@/lib/appwrite"
import { ID } from "appwrite"

export const consultationService = {
  // Create a new consultation
  async createConsultation(consultationData) {
    try {
      const response = await databases.createDocument(DATABASE_ID, COLLECTIONS.CONSULTATIONS, ID.unique(), {
        patientId: consultationData.patientId,
        consultationDate: consultationData.consultationDate || new Date().toISOString(),
        chiefComplaint: consultationData.chiefComplaint || [],
        chiefComplaintNotes: consultationData.chiefComplaintNotes || "",
        symptoms: consultationData.symptoms || "",
        O_E: consultationData.O_E || "",
        BP: consultationData.BP || "",
        Pulse: consultationData.Pulse || "",
        Temp: consultationData.Temp || "",
        investigation: consultationData.investigation || [],
        chamberId: consultationData.chamberId,
        diagnosis: consultationData.diagnosis || "",
        notes: consultationData.notes || "",
        followUpDate: consultationData.followUpDate || null,
        billAmount: consultationData.billAmount || 0,
      })
      return response
    } catch (error) {
      console.error("Error creating consultation:", error)
      throw error
    }
  },

  // Get all consultations with pagination
  async getConsultations(limit = 25, offset = 0) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CONSULTATIONS, [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("consultationDate"),
      ])
      return response
    } catch (error) {
      console.error("Error fetching consultations:", error)
      throw error
    }
  },

  // Get consultations for a specific patient
  async getPatientConsultations(patientId, limit = 10) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CONSULTATIONS, [
        Query.equal("patientId", patientId),
        Query.limit(limit),
        Query.orderDesc("consultationDate"),
      ])
      return response
    } catch (error) {
      console.error("Error fetching patient consultations:", error)
      throw error
    }
  },

  // Get today's consultations
  async getTodayConsultations() {
    try {
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CONSULTATIONS, [
        Query.greaterThanEqual("consultationDate", startOfDay),
        Query.lessThanEqual("consultationDate", endOfDay),
        Query.orderAsc("consultationDate"),
      ])
      return response
    } catch (error) {
      console.error("Error fetching today's consultations:", error)
      throw error
    }
  },

  // Get a single consultation
  async getConsultation(consultationId) {
    try {
      const response = await databases.getDocument(DATABASE_ID, COLLECTIONS.CONSULTATIONS, consultationId)
      return response
    } catch (error) {
      console.error("Error fetching consultation:", error)
      throw error
    }
  },

  // Update consultation
  async updateConsultation(consultationId, updateData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CONSULTATIONS,
        consultationId,
        updateData,
      )
      return response
    } catch (error) {
      console.error("Error updating consultation:", error)
      throw error
    }
  },

  // Delete consultation
  async deleteConsultation(consultationId) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CONSULTATIONS, consultationId)
      return true
    } catch (error) {
      console.error("Error deleting consultation:", error)
      throw error
    }
  },
}
