
import { databases } from '@/lib/appwirte/client';
import { ID, Query } from 'appwrite';
import patientsService from './patients';

// Ensure your environment variables are correctly loaded and available
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID;
const APPWRITE_PATIENT_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID; // নতুন: হ্যাবিট কালেকশন ID


const DEFAULT_QUERY_LIMIT = 100;

function getAppwriteError(error) {
  if (error && typeof error === 'object') {
    if (error.response && typeof error.response.message === 'string') {
      return error.response.message;
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
    if (error.code) {
      return `Appwrite Error (Code: ${error.code})`;
    }
  }
  return "An unexpected error occurred.";
}

const patientConsultationsService = {

  async createConsultation(consultationData) {
    if (!consultationData) {
      throw new Error("Consultation data is required to create a consultation.");
    }
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID,
        ID.unique(),
        consultationData
      );
      console.log("Appwrite: Consultation document created.", response.$id);
      return response;
    } catch (error) {
      console.error('Error creating consultation document:', error);
      throw getAppwriteError(error);
    }
  },

  async createPatientAndFirstConsultation(fullFormData) {
    const { patientDetails, consultationDetails, prescription, habitsAndHistory } = fullFormData;

    try {
      // 1. ডুপ্লিকেট রোগী চেক (সিরিয়াল এবং ফোন নম্বর দিয়ে)
      const existingPatientsBySerial = await patientsService.searchPatientsBySerialNumber(patientDetails.serialNumber);
      if (existingPatientsBySerial && existingPatientsBySerial.length > 0) {
        throw new Error(`Patient with serial number '${patientDetails.serialNumber}' already exists.`);
      }

      // 2. নতুন রোগী তৈরি
      const newPatient = await patientsService.createPatient(patientDetails);
      console.log("Service: New patient created with ID:", newPatient.$id);
      const patientId = newPatient.$id; // রোগীর ID পাওয়া গেল

      // 3. কনসালটেশন ডেটা প্রস্তুত করা
      const consultationDataToSave = {
        ...consultationDetails,
        patientId: patientId, // নতুন রোগীর ID সেট করা হয়েছে

        // প্রেসক্রিপশন ডেটা (যদি থাকে)
        prescriptions: prescription?.medicines?.map(med => ({
          name: med.name,
          dosage: med.dosage || "", // নিশ্চিত করুন dosage অ্যাট্রিবিউট আছে
        })) || [],
        dosageInstructions: prescription?.dosageInstructions || [],
        prescriptionNotes: prescription?.prescriptionNotes || "",

        // dietAndLifestyleAdvice: consultationDetails এর 'advice' থেকে ম্যাপ করা
        dietAndLifestyleAdvice: consultationDetails.advice ? [consultationDetails.advice] : [],
        // familyHistory: habitsAndHistory থেকে নেওয়া হবে, যদি consultationDetails-এ না থাকে
        familyHistory: consultationDetails.familyHistory || habitsAndHistory?.familyHistory || "",
      };
      // original `advice` field from consultationDetails, if not needed in Appwrite
      delete consultationDataToSave.advice;


      // 4. প্রথম কনসালটেশন তৈরি করা
      const newConsultation = await this.createConsultation(consultationDataToSave);
      const consultationId = newConsultation.$id; // নতুন কনসালটেশনের ID পাওয়া গেল

      // 5. রোগীর অভ্যাস এবং অন্যান্য ইতিহাস সেভ করা (যদি থাকে)
      if (habitsAndHistory && APPWRITE_PATIENT_HABITS_COLLECTION_ID) { // নিশ্চিত করুন কালেকশন আইডি আছে
        // একটি সিঙ্গেল ডকুমেন্ট হিসেবে সেভ করা
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_PATIENT_HABITS_COLLECTION_ID,
          ID.unique(),
          {
            patientId: patientId,
            consultationId: consultationId, // এই কনসালটেশনের সাথে লিঙ্ক করা
            personalHistory: habitsAndHistory.personalHistory || "",
            familyHistory: habitsAndHistory.familyHistory || "", // নিশ্চিত করুন এটি এখানে সেভ হচ্ছে
            allergies: habitsAndHistory.allergies || "",
            pastMedicalHistory: habitsAndHistory.pastMedicalHistory || "",
            drugHistory: habitsAndHistory.drugHistory || "",
            smokingHistory: habitsAndHistory.smokingHistory || "",
            alcoholHistory: habitsAndHistory.alcoholHistory || "",
          }
        );
        console.log("Service: Patient habits and history created.");
      }

      return { newPatient, newConsultation };
    } catch (error) {
      console.error('Service Error: Failed to create patient and first consultation:', error);
      throw getAppwriteError(error);
    }
  },

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
          Query.orderDesc('$createdAt'),
          // Option 2: If you have a specific DateTime attribute for consultation date
          // Query.orderDesc('consultationDate'), // Use this if you have a `consultationDate` attribute of type DateTime
          // Option 3: If you truly have separate 'date' (e.g., YYYY-MM-DD string) and 'time' (e.g., HH:MM string) attributes AND they are indexed.
          // In most cases, a single DateTime attribute is better for chronological ordering.
          // If 'date' and 'time' are present and indexed, your original query would be correct.
          // But based on the error, they are likely not.
          Query.limit(DEFAULT_QUERY_LIMIT)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error(`Error getting consultations for patient ${patientId}:`, error);
      throw error;
    }
  },

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
  },

  

  getAppwriteError: getAppwriteError,

};

export default patientConsultationsService;

