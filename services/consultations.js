
import { databases } from '@/lib/appwirte/client';
import { ID, Query } from 'appwrite';

// Ensure your environment variables are correctly loaded and available
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID;

// Define a maximum limit for document fetching to prevent accidental large fetches
// Appwrite's default limit for listDocuments is 100
const DEFAULT_QUERY_LIMIT = 100;

const consultationsService = {
  /**
   * Fetches consultations for a specific patient, ordered by the latest first.
   * Assumes you have either:
   * 1. No specific 'date' or 'time' attributes, and rely on Appwrite's $createdAt.
   * 2. A 'consultationDate' (DateTime) and/or 'consultationTime' (String) attribute in your schema.
   * If you have a single DateTime attribute for the consultation date/time, use that.
   * @param {string} patientId The ID of the patient.
   * @returns {Promise<Array<Object>>} An array of consultation documents.
   */
  async getConsultationsByPatientId(patientId) {
    if (!patientId) {
      throw new Error("Patient ID is required to fetch consultations.");
    }
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        [
          Query.equal('patientId', patientId),
          // ✅ FIX for "Attribute not found in schema: date" error
          // Option 1: Rely on Appwrite's built-in creation timestamp
          Query.orderDesc('$createdAt'),
          // Option 2: If you have a specific DateTime attribute for consultation date
          // Query.orderDesc('consultationDate'), // Use this if you have a `consultationDate` attribute of type DateTime
          // Option 3: If you truly have separate 'date' (e.g., YYYY-MM-DD string) and 'time' (e.g., HH:MM string) attributes AND they are indexed.
          // In most cases, a single DateTime attribute is better for chronological ordering.
          // If 'date' and 'time' are present and indexed, your original query would be correct.
          // But based on the error, they are likely not.
          Query.limit(DEFAULT_QUERY_LIMIT) // Add a limit to prevent fetching too many documents
        ]
      );
      return response.documents;
    } catch (error) {
      console.error(`Error getting consultations for patient ${patientId}:`, error);
      // Re-throw to allow higher-level error handling (e.g., react-query's onError)
      throw error;
    }
  },

  /**
   * Creates a new consultation record.
   * @param {Object} consultationData The data for the new consultation.
   * @returns {Promise<Object>} The created consultation document.
   */
  async createConsultation(consultationData) {
    if (!consultationData) {
      throw new Error("Consultation data is required to create a consultation.");
    }
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        ID.unique(), // Generates a unique ID for the new document
        consultationData
      );
      return response;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  /**
   * Fetches a single consultation by its ID.
   * @param {string} consultationId The ID of the consultation.
   * @returns {Promise<Object>} The consultation document.
   */
  async getConsultationById(consultationId) {
    if (!consultationId) {
      throw new Error("Consultation ID is required to fetch a consultation.");
    }
    try {
      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        consultationId
      );
      return response;
    } catch (error) {
      console.error(`Error getting consultation by ID ${consultationId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches all consultations.
   * Use with caution as this can fetch a large number of documents.
   * Consider adding pagination if this is used in production for large datasets.
   * @returns {Promise<Array<Object>>} An array of all consultation documents.
   */
  async getAllConsultations() {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'), // Order by creation timestamp
          Query.limit(DEFAULT_QUERY_LIMIT) // Apply a default limit
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error getting all consultations:', error);
      throw error;
    }
  },

  /**
   * Updates an existing consultation record.
   * @param {string} consultationId The ID of the consultation to update.
   * @param {Object} data The data to update the consultation with.
   * @returns {Promise<Object>} The updated consultation document.
   */
  async updateConsultation(consultationId, data) {
    if (!consultationId || !data) {
      throw new Error("Consultation ID and data are required to update a consultation.");
    }
    try {
      const response = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        consultationId,
        data
      );
      return response;
    } catch (error) {
      console.error(`Error updating consultation ${consultationId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a consultation record.
   * @param {string} consultationId The ID of the consultation to delete.
   * @returns {Promise<boolean>} True if deletion was successful.
   */
  async deleteConsultation(consultationId) {
    if (!consultationId) {
      throw new Error("Consultation ID is required to delete a consultation.");
    }
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        consultationId
      );
      return true; // Indicate successful deletion
    } catch (error) {
      console.error(`Error deleting consultation ${consultationId}:`, error);
      throw error;
    }
  }
};

export default consultationsService;