// services/patients.js
import { databases } from '@/lib/appwirte/client';
import { Query, ID } from 'appwrite';

// Environment variables are typically strings, good practice to keep them explicitly
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID;

// Basic validation for environment variables
if (!DATABASE_ID || !PATIENTS_COLLECTION_ID) {
  console.error("Missing Appwrite environment variables: NEXT_PUBLIC_APPWRITE_DATABASE_ID or NEXT_PUBLIC_COLLECTION_PATIENTS_ID");
  // Optionally, throw an error or handle gracefully in a production environment
}

const patientsService = {
  /**
   * Fetches all patient documents from the database, ordered by creation date descending.
   * @returns {Promise<Array<Object>>} An array of patient documents.
   * @throws {Error} If there's an issue fetching patients from Appwrite.
   */
  async getAllPatients() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        [Query.orderDesc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error('Failed to fetch all patients:', error);
      throw new Error(`Failed to retrieve all patients: ${error.message || error}`);
    }
  },

  /**
   * Creates a new patient document in the database.
   * A unique ID is generated for the new patient.
   * @param {Object} patientData - The data for the new patient.
   * @returns {Promise<Object>} The newly created patient document.
   * @throws {Error} If there's an issue creating the patient.
   */
  async createPatient(patientData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        ID.unique(),
        patientData
      );
      return response;
    } catch (error) {
      console.error('Failed to create patient:', error);
      throw new Error(`Failed to create patient record: ${error.message || error}`);
    }
  },

  /**
   * Fetches patient documents based on provided Appwrite queries.
   * This is a versatile function for getting multiple patients with specific conditions.
   * @param {Array<Query>} queries - An array of Appwrite Query objects (e.g., [Query.equal('name', 'John Doe')]). Defaults to an empty array (fetches all if no queries).
   * @returns {Promise<Array<Object>>} An array of patient documents matching the queries.
   * @throws {Error} If there's an issue fetching patients with queries.
   */
  async getPatients(queries = []) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        queries
      );
      return response.documents;
    } catch (error) {
      console.error('Failed to fetch patients with custom queries:', error);
      throw new Error(`Failed to retrieve patients with queries: ${error.message || error}`);
    }
  },

  /**
   * Fetches a single patient document by its unique ID.
   * This is the recommended function for fetching a specific patient by their ID.
   * @param {string} patientId - The unique ID of the patient.
   * @returns {Promise<Object>} The patient document.
   * @throws {Error} If the patient is not found or there's an issue fetching it.
   */
  async getPatient(patientId) { // Renamed from getPatientById to getPatient for consistency with useQuery
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        patientId
      );
      return response;
    } catch (error) {
      // Appwrite throws 404 for not found, which is a common scenario
      if (error.code === 404) {
        console.warn(`Patient with ID ${patientId} not found.`);
        return null; // Return null if not found, allowing calling code to handle gracefully
      }
      console.error(`Failed to fetch patient with ID ${patientId}:`, error);
      throw new Error(`Failed to retrieve patient ${patientId}: ${error.message || error}`);
    }
  },

  /**
   * Updates an existing patient document by its ID.
   * @param {string} patientId - The unique ID of the patient to update.
   * @param {Object} patientData - The partial or full data to update.
   * @returns {Promise<Object>} The updated patient document.
   * @throws {Error} If there's an issue updating the patient.
   */
  async updatePatient(patientId, patientData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        patientId,
        patientData
      );
      return response;
    } catch (error) {
      console.error(`Failed to update patient with ID ${patientId}:`, error);
      throw new Error(`Failed to update patient ${patientId}: ${error.message || error}`);
    }
  },

  /**
   * Deletes a patient document by its ID.
   * @param {string} patientId - The unique ID of the patient to delete.
   * @returns {Promise<boolean>} True if the patient was successfully deleted.
   * @throws {Error} If there's an issue deleting the patient.
   */
  async deletePatient(patientId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        patientId
      );
      return true;
    } catch (error) {
      console.error(`Failed to delete patient with ID ${patientId}:`, error);
      throw new Error(`Failed to delete patient ${patientId}: ${error.message || error}`);
    }
  },

 
  async searchPatientsBySerialNumber(serialNumber) {
    if (!serialNumber) {
      throw new Error("Serial number cannot be empty for search.");
    }
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        [Query.equal('serialNumber', serialNumber)]
      );
      return response.documents;
    } catch (error) {
      console.error(`Failed to search patient by serial number ${serialNumber}:`, error);
      throw new Error(`Failed to search for patient by serial number: ${error.message || error}`);
    }
  },


  async searchPatientsByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      throw new Error("Phone number cannot be empty for search.");
    }
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        [Query.equal('phoneNumber', phoneNumber)]
      );
      return response.documents;
    } catch (error) {
      console.error(`Failed to search patient by phone number ${phoneNumber}:`, error);
      throw new Error(`Failed to search for patient by phone number: ${error.message || error}`);
    }
  },
};

export default patientsService;