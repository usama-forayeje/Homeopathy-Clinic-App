
import { databases } from "@/lib/appwirte/client"
import { Query, ID } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID

if (!DATABASE_ID || !PATIENTS_COLLECTION_ID) {
  console.error(
    "Missing Appwrite environment variables: NEXT_PUBLIC_APPWRITE_DATABASE_ID or NEXT_PUBLIC_COLLECTION_PATIENTS_ID",
  )
}

const patientsService = {

  async getAllPatients() {
    try {
      const response = await databases.listDocuments(DATABASE_ID, PATIENTS_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
      ])
      return response.documents
    } catch (error) {
      console.error("Failed to fetch all patients:", error)
      throw new Error(`Failed to retrieve all patients: ${error.message || error}`)
    }
  },

  async createPatient(patientData) {
    try {
      const response = await databases.createDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, ID.unique(), patientData)
      return response
    } catch (error) {
      console.error("Failed to create patient:", error)
      throw new Error(`Failed to create patient record: ${error.message || error}`)
    }
  },

  async getPatients(searchTerm = "", limit = 25, offset = 0) {
    const queries = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("$createdAt"),
    ];

    if (searchTerm) {

      const searchConditions = [];

      searchConditions.push(Query.search('name', searchTerm));

      searchConditions.push(Query.equal('phoneNumber', searchTerm));

      searchConditions.push(Query.equal('serialNumber', searchTerm));

      if (searchConditions.length > 0) {
        queries.push(Query.or(...searchConditions));
      }
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        queries,
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch patients with custom queries:", error);
      throw new Error(`Failed to retrieve patients with queries: ${error.message || error}`);
    }
  },

  async getPatient(patientId) {
    try {
      const response = await databases.getDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, patientId)
      return response
    } catch (error) {
      if (error.code === 404) {
        console.warn(`Patient with ID ${patientId} not found.`)
        return null
      }
      console.error(`Failed to fetch patient with ID ${patientId}:`, error)
      throw new Error(`Failed to retrieve patient ${patientId}: ${error.message || error}`)
    }
  },

  async updatePatient(patientId, patientData) {
    try {
      const response = await databases.updateDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, patientId, patientData)
      return response
    } catch (error) {
      console.error(`Failed to update patient with ID ${patientId}:`, error)
      throw new Error(`Failed to update patient ${patientId}: ${error.message || error}`)
    }
  },

  async deletePatient(patientId) {
    try {
      await databases.deleteDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, patientId)
      return true
    } catch (error) {
      console.error(`Failed to delete patient with ID ${patientId}:`, error)
      throw new Error(`Failed to delete patient ${patientId}: ${error.message || error}`)
    }
  },

  async searchPatientsBySerialNumber(serialNumber) {
    if (!serialNumber) {
      throw new Error("Serial number cannot be empty for search.")
    }
    try {
      const response = await databases.listDocuments(DATABASE_ID, PATIENTS_COLLECTION_ID, [
        Query.equal("serialNumber", serialNumber),
      ])
      return response.documents
    } catch (error) {
      console.error(`Failed to search patient by serial number ${serialNumber}:`, error)
      throw new Error(`Failed to search for patient by serial number: ${error.message || error}`)
    }
  },

  async searchPatientsByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      throw new Error("Phone number cannot be empty for search.")
    }
    try {
      const response = await databases.listDocuments(DATABASE_ID, PATIENTS_COLLECTION_ID, [
        Query.equal("phoneNumber", phoneNumber),
      ])
      return response.documents
    } catch (error) {
      console.error(`Failed to search patient by phone number ${phoneNumber}:`, error)
      throw new Error(`Failed to search for patient by phone number: ${error.message || error}`)
    }
  },
}

export default patientsService
