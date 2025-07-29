
import { databases } from "@/lib/appwirte/client"
import { ID, Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID
const CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID
const PATIENTS_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID

class PatientConsultationsService {
    // Create patient and first consultation
    async createPatientAndFirstConsultation(data) {
        try {
            console.log("Creating patient and consultation with data:", data)

            // Create patient first
            const patientData = {
                ...data.patientDetails,
                firstConsultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
            }

            const newPatient = await databases.createDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, ID.unique(), patientData)

            console.log("Patient created:", newPatient)

            // Create consultation
            const consultationData = {
                ...data.consultationDetails,
                patientId: newPatient.$id,
                consultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
                followUpDate: data.consultationDetails.followUpDate
                    ? new Date(data.consultationDetails.followUpDate).toISOString()
                    : null,
            }

            const newConsultation = await databases.createDocument(
                DATABASE_ID,
                CONSULTATIONS_COLLECTION_ID,
                ID.unique(),
                consultationData,
            )

            console.log("Consultation created:", newConsultation)

            // Create patient habits if any
            const habitPromises = (data.patientHabits || []).map((habit) =>
                databases.createDocument(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, ID.unique(), {
                    ...habit,
                    patientId: newPatient.$id,
                    consultationId: newConsultation.$id,
                    recordedDate: new Date().toISOString(),
                }),
            )

            const createdHabits = await Promise.all(habitPromises)
            console.log("Habits created:", createdHabits)

            return {
                newPatient,
                newConsultation,
                createdHabits,
            }
        } catch (error) {
            console.error("Error creating patient and consultation:", error)
            throw new Error(`Failed to create patient and consultation: ${error.message}`)
        }
    }

    // Get all consultations
    async getAllConsultations() {
        try {
            const response = await databases.listDocuments(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, [
                Query.orderDesc("consultationDate"),
                Query.limit(100),
            ])
            return response.documents
        } catch (error) {
            console.error("Error fetching consultations:", error)
            throw new Error(`Failed to fetch consultations: ${error.message}`)
        }
    }

    // Get consultation by ID
    async getConsultationById(consultationId) {
        try {
            const consultation = await databases.getDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, consultationId)
            return consultation
        } catch (error) {
            console.error("Error fetching consultation:", error)
            throw new Error(`Failed to fetch consultation: ${error.message}`)
        }
    }

    // Get consultations by patient ID
    async getConsultationsByPatientId(patientId) {
        try {
            const response = await databases.listDocuments(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, [
                Query.equal("patientId", patientId),
                Query.orderDesc("consultationDate"),
            ])
            return response.documents
        } catch (error) {
            console.error("Error fetching patient consultations:", error)
            throw new Error(`Failed to fetch patient consultations: ${error.message}`)
        }
    }

    // Update consultation
    async updateConsultation(consultationId, data) {
        try {
            const updatedConsultation = await databases.updateDocument(
                DATABASE_ID,
                CONSULTATIONS_COLLECTION_ID,
                consultationId,
                {
                    ...data.consultationDetails,
                    consultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
                    followUpDate: data.consultationDetails.followUpDate
                        ? new Date(data.consultationDetails.followUpDate).toISOString()
                        : null,
                },
            )
            return updatedConsultation
        } catch (error) {
            console.error("Error updating consultation:", error)
            throw new Error(`Failed to update consultation: ${error.message}`)
        }
    }

    // Delete consultation
    async deleteConsultation(consultationId) {
        try {
            await databases.deleteDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, consultationId)
            return { success: true }
        } catch (error) {
            console.error("Error deleting consultation:", error)
            throw new Error(`Failed to delete consultation: ${error.message}`)
        }
    }

    // Create new consultation for existing patient
    async createConsultationForExistingPatient(patientId, consultationData) {
        try {
            const newConsultation = await databases.createDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, ID.unique(), {
                ...consultationData,
                patientId,
                consultationDate: new Date(consultationData.consultationDate).toISOString(),
                followUpDate: consultationData.followUpDate ? new Date(consultationData.followUpDate).toISOString() : null,
            })
            return newConsultation
        } catch (error) {
            console.error("Error creating consultation:", error)
            throw new Error(`Failed to create consultation: ${error.message}`)
        }
    }
}

const patientConsultationsService = new PatientConsultationsService()
export default patientConsultationsService
