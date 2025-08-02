import { databases } from "@/lib/appwirte/client"; // Appwrite client import পাথ নিশ্চিত করুন
import { ID, Query } from "appwrite";

// পরিবেশ ভেরিয়েবলগুলো নিশ্চিত করুন যে সঠিকভাবে লোড হয়েছে
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID;
const APPWRITE_CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID;
const APPWRITE_PATIENT_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID;

// এই সার্ভিসটি patientsService থেকে রোগীদের জন্য সার্চ ফাংশনগুলি ব্যবহার করবে
// নিশ্চিত করুন যে patientsService ফাইলটি সঠিকভাবে ইম্পোর্ট করা হয়েছে
// এবং তাতে searchPatientsBySerialNumber ও searchPatientsByPhoneNumber ফাংশনগুলো আছে।
// উদাহরণস্বরূপ: import patientsService from './patients';
// কিন্তু যেহেতু আপনার আগের প্রশ্নে patientsService এর কোড ছিল না,
// আমি এখানে একটি ডামি ইমপ্লিমেন্টেশন দিচ্ছি যা আপনাকে patients.js ফাইল থেকে ইম্পোর্ট করতে হবে।
//
// আপনার আসল patients.js ফাইলটি এমন হতে পারে:
// import { databases } from "@/lib/appwirte/client";
// import { Query } from "appwrite";
// const APPWRITE_PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID;
// const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
// const patientsService = {
//   async searchPatientsBySerialNumber(serialNumber) { /* ... implementation ... */ },
//   async searchPatientsByPhoneNumber(phoneNumber) { /* ... implementation ... */ },
//   async createPatient(patientData) { /* ... implementation ... */ },
// };
// export default patientsService;

// Assuming patientsService is imported from a separate file:
import patientsService from "./patients"; // <--- এই লাইনটি আপনার patients.js ফাইলকে নির্দেশ করছে


class PatientConsultationsService {
  constructor() {
    this.cache = new Map();
    this.retryCount = 3;
    this.retryDelay = 1000;

    // নিশ্চিত করুন সব পরিবেশ ভেরিয়েবল লোড হয়েছে
    if (!APPWRITE_DATABASE_ID || !APPWRITE_PATIENTS_COLLECTION_ID || !APPWRITE_CONSULTATIONS_COLLECTION_ID) {
      console.error("Critical: Appwrite environment variables are not loaded!");
      // প্রয়োজনে এখানে আরও শক্তিশালী এরর হ্যান্ডলিং যোগ করুন
    }
  }

  // --- Utility Methods ---

  /**
   * Enhanced error message formatting.
   */
  getErrorMessage(error) {
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

  /**
   * Generic retry mechanism for Appwrite operations.
   */
  async retryOperation(operation, maxRetries = this.retryCount) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error; // Last attempt, re-throw the error
        }

        // Don't retry on validation or authorization errors, or if it's not a network issue
        if (error.message?.includes("Validation") || error.message?.includes("Unauthorized") || error.code === 400 || error.code === 401 || error.code === 403) {
          throw error;
        }

        console.warn(`Attempt ${attempt} failed. Retrying in ${this.retryDelay * attempt}ms...`, error.message);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

 
  sanitizeConsultationData(data) {
    const patientDetails = data.patientDetails || {};
    const consultationDetails = data.consultationDetails || {};
    const prescription = data.prescription || {};
    const habitsAndHistory = data.habitsAndHistory || {};
    const patientHabits = data.patientHabits || []; // Ensure patientHabits is an array

    const sanitizedPatientDetails = {
      name: patientDetails.name?.trim() || "",
      age: Number(patientDetails.age) || 0, // Ensure age is a number
      gender: patientDetails.gender || "Other", // Default gender
      phoneNumber: patientDetails.phoneNumber?.trim() || "",
      serialNumber: patientDetails.serialNumber?.trim() || "",
      address: patientDetails.address?.trim() || null,
      occupation: patientDetails.occupation?.trim() || null,
      bloodGroup: patientDetails.bloodGroup?.trim() || null,
      notes: patientDetails.notes?.trim() || null,
      dob: patientDetails.dob ? new Date(patientDetails.dob).toISOString() : null,
      // `firstConsultationDate` will be set based on the actual consultation date later
      firstConsultationDate: new Date(consultationDetails.consultationDate || Date.now()).toISOString(),
    };

    const sanitizedConsultationDetails = {
      // Ensure date is a valid ISO string
      consultationDate: new Date(consultationDetails.consultationDate || Date.now()).toISOString(),
      chamberId: consultationDetails.chamberId?.trim() || "",
      
      // Crucial Fixes for 'filter' on undefined
      chiefComplaint: (consultationDetails.chiefComplaints || []).filter((c) => c?.trim()), // Use ?. and filter(Boolean) or c?.trim()
      diagnosis: (consultationDetails.diagnosis || []).filter((d) => d?.trim()),
      otherComplaints: (consultationDetails.otherComplaints || []).filter((c) => c?.trim()),

      // Medications from the 'prescription' section of the form
      // Assuming `prescription.medicines` contains objects with `medicineId`, `name`, `dosage`
      prescriptions: (prescription.medicines || [])
        .map(med => ({
          medicineId: med.medicineId || ID.unique(), // Use provided ID or generate
          name: med.name?.trim() || '',
          dosage: med.dosage?.trim() || '',
        }))
        .filter(p => p.name), // Ensure medicine has a name

      // Dosage instructions from the 'prescription' section
      dosageInstructions: (prescription.dosageInstructions || [])
        .filter((i) => (typeof i === "string" ? i.trim() : i?.predefinedInstruction?.trim() || i?.customInstruction?.trim()))
        .map((instruction) => {
          if (typeof instruction === "object") {
            return instruction.predefinedInstruction || instruction.customInstruction || "";
          }
          return instruction?.trim() || "";
        }),

      // Prescription notes from the 'prescription' section
      prescriptionNotes: prescription.prescriptionNotes?.trim() || null,

      // Diet and Lifestyle Advice (mapped from `advice` field)
      dietAndLifestyleAdvice: (consultationDetails.advice ? [consultationDetails.advice] : [])
        .filter(a => a?.trim()), // ensure it's an array and filter

      // Other fields, ensuring proper defaults or nulls
      followUpDate: consultationDetails.followUpDate
        ? new Date(consultationDetails.followUpDate).toISOString()
        : null,
      symptoms: consultationDetails.symptoms?.trim() || null,
      BP: consultationDetails.BP?.trim() || null,
      Pulse: consultationDetails.Pulse?.trim() || null,
      Temp: consultationDetails.Temp?.trim() || null,
      historyOfPresentIllness: consultationDetails.historyOfPresentIllness?.trim() || null,
      // Family history can come from consultationDetails or habitsAndHistory
      familyHistory: (consultationDetails.familyHistory?.trim() || habitsAndHistory.familyHistory?.trim()) || null,
      O_E: consultationDetails.O_E?.trim() || null,
      notes: consultationDetails.notes?.trim() || null,
      billAmount: Number(consultationDetails.billAmount) || 0, // Ensure billAmount is a number
    };

    // Patient habits for the separate collection
    const sanitizedPatientHabits = (habitsAndHistory.patientHabits || patientHabits) // Use habitsAndHistory.patientHabits if available
      .filter((habit) => habit.habitDefinitionId && habit.value) // Only include habits with essential fields
      .map((habit) => ({
        habitDefinitionId: habit.habitDefinitionId,
        value: habit.value?.trim(),
        notes: habit.notes?.trim() || null,
        recordedDate: new Date().toISOString(), // Record creation date for habit
      }));


    // console.log("Sanitized Data:", {
    //   patientDetails: sanitizedPatientDetails,
    //   consultationDetails: sanitizedConsultationDetails,
    //   patientHabits: sanitizedPatientHabits,
    // }); // Debug log

    return {
      patientDetails: sanitizedPatientDetails,
      consultationDetails: sanitizedConsultationDetails,
      // We pass patientHabits separately as it goes to a different collection
      patientHabits: sanitizedPatientHabits, 
    };
  }

  // ========================================== Core CRUD Operations ==========================================

  /**
   * Create a new consultation record.
   */
  async createConsultation(consultationData) {
    if (!consultationData) {
      throw new Error("Consultation data is required to create a consultation.");
    }
    try {
      const response = await this.retryOperation(async () =>
        databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONSULTATIONS_COLLECTION_ID,
          ID.unique(),
          consultationData
        )
      );
      console.log("Appwrite: Consultation document created.", response.$id);
      return response;
    } catch (error) {
      console.error('Error creating consultation document:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Creates a new patient and their first consultation.
   * This is the primary function for a new patient registration.
   */
  async createPatientAndFirstConsultation(fullFormData) {
    try {
      console.log("🚀 Starting patient and consultation creation...");

      // Sanitize and transform data
      const sanitizedData = this.sanitizeConsultationData(fullFormData);
      console.log("✅ Data sanitization completed.");

      // 1. Check for duplicate patient (by serial number and phone number)
      const existingPatientsBySerial = await patientsService.searchPatientsBySerialNumber(sanitizedData.patientDetails.serialNumber);
      if (existingPatientsBySerial && existingPatientsBySerial.length > 0) {
        throw new Error(`Patient with serial number '${sanitizedData.patientDetails.serialNumber}' already exists.`);
      }

      const existingPatientsByPhone = await patientsService.searchPatientsByPhoneNumber(sanitizedData.patientDetails.phoneNumber);
      if (existingPatientsByPhone && existingPatientsByPhone.length > 0) {
        throw new Error(`Patient with phone number '${sanitizedData.patientDetails.phoneNumber}' already exists.`);
      }

      // 2. Create new patient
      const newPatient = await this.retryOperation(async () => {
        console.log("📝 Creating patient...");
        return await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_PATIENTS_COLLECTION_ID,
          ID.unique(),
          sanitizedData.patientDetails,
        );
      });
      console.log("✅ Patient created:", newPatient.$id);
      const patientId = newPatient.$id;

      // 3. Prepare consultation data (link with new patient ID)
      const consultationDataToSave = {
        ...sanitizedData.consultationDetails,
        patientId: patientId,
      };

      // 4. Create the first consultation
      const newConsultation = await this.retryOperation(async () => {
        console.log("📝 Creating consultation...");
        return await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONSULTATIONS_COLLECTION_ID,
          ID.unique(),
          consultationDataToSave,
        );
      });
      console.log("✅ Consultation created:", newConsultation.$id);
      const consultationId = newConsultation.$id;

      // 5. Save patient habits if any
      let createdHabits = [];
      if (sanitizedData.patientHabits && sanitizedData.patientHabits.length > 0 && APPWRITE_PATIENT_HABITS_COLLECTION_ID) {
        console.log(`📝 Creating ${sanitizedData.patientHabits.length} patient habits...`);

        const habitPromises = sanitizedData.patientHabits.map((habit) =>
          this.retryOperation(
            async () =>
              await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_PATIENT_HABITS_COLLECTION_ID,
                ID.unique(),
                {
                  ...habit,
                  patientId: patientId, // Link habit to new patient
                  consultationId: consultationId, // Link habit to first consultation
                }),
          ),
        );
        createdHabits = await Promise.all(habitPromises);
        console.log(`✅ ${createdHabits.length} habits created`);
      }

      const result = {
        newPatient,
        newConsultation,
        createdHabits,
        summary: {
          patientId: patientId,
          consultationId: consultationId,
          habitsCount: createdHabits.length,
          createdAt: new Date().toISOString(),
        },
      };

      console.log("🎉 Patient and consultation creation completed successfully.");
      return result;
    } catch (error) {
      console.error("❌ Error in createPatientAndFirstConsultation:", error);
      const enhancedError = new Error(this.getErrorMessage(error));
      enhancedError.originalError = error;
      enhancedError.context = { fullFormData, timestamp: new Date().toISOString() };
      throw enhancedError;
    }
  }

  /**
   * Get all consultations with filtering and pagination
   */
  async getAllConsultations(filters = {}) {
    try {
      const queries = [Query.orderDesc("consultationDate")];

      // Add filters
      if (filters.patientId) {
        queries.push(Query.equal("patientId", filters.patientId));
      }
      if (filters.chamberId) {
        queries.push(Query.equal("chamberId", filters.chamberId));
      }
      if (filters.startDate) {
        queries.push(Query.greaterThanEqual("consultationDate", filters.startDate));
      }
      if (filters.endDate) {
        queries.push(Query.lessThanEqual("consultationDate", filters.endDate));
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      } else {
        queries.push(Query.limit(100)); // Default limit
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await this.retryOperation(
        async () => await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, queries),
      );

      return {
        documents: response.documents,
        total: response.total,
        hasMore: response.documents.length === (filters.limit || 100),
      };
    } catch (error) {
      console.error("Error fetching consultations:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get consultation by ID with related data
   */
  async getConsultationById(consultationId) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required");
      }

      // Check cache first
      const cacheKey = `consultation_${consultationId}`;
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) {
          // 5 minutes cache
          return cached.data;
        }
      }

      const consultation = await this.retryOperation(
        async () => await databases.getDocument(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, consultationId),
      );

      // Get related patient data (assuming getPatientById is in patientsService or in this class)
      // If getPatientById is in patientsService, you'll need to call it like:
      // const patient = await patientsService.getPatientById(consultation.patientId);
      // For now, assuming it's a helper in this class.
      const patient = await this.getPatientById(consultation.patientId);

      // Get patient habits for this consultation
      const habits = await this.getConsultationHabits(consultationId);

      const enrichedConsultation = {
        ...consultation,
        patient,
        habits,
        _metadata: {
          hasPatient: !!patient,
          habitsCount: habits.length,
          fetchedAt: new Date().toISOString(),
        },
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: enrichedConsultation,
        timestamp: Date.now(),
      });

      return enrichedConsultation;
    } catch (error) {
      console.error("Error fetching consultation:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get patient by ID (helper method - consider moving to patientsService if it's patient-centric)
   */
  async getPatientById(patientId) {
    try {
      return await this.retryOperation(
        async () => await databases.getDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_COLLECTION_ID, patientId),
      );
    } catch (error) {
      console.warn("Could not fetch patient data:", error);
      return null; // Return null if patient not found, don't throw
    }
  }

  /**
   * Get consultation habits (helper method)
   */
  async getConsultationHabits(consultationId) {
    try {
      const response = await this.retryOperation(
        async () =>
          await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_HABITS_COLLECTION_ID, [
            Query.equal("consultationId", consultationId),
          ]),
      );
      return response.documents;
    } catch (error) {
      console.warn("Could not fetch consultation habits:", error);
      return [];
    }
  }

  /**
   * Get consultations by patient ID with pagination
   */
  async getConsultationsByPatientId(patientId, options = {}) {
    try {
      if (!patientId) {
        throw new Error("Patient ID is required");
      }

      const queries = [Query.equal("patientId", patientId), Query.orderDesc("consultationDate")];

      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await this.retryOperation(
        async () => await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, queries),
      );

      return {
        consultations: response.documents,
        total: response.total,
        hasMore: response.documents.length === (options.limit || response.documents.length),
      };
    } catch (error) {
      console.error("Error fetching patient consultations:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get today's consultations
   */
  async getTodayConsultations() {
    try {
      const today = new Date();
      // Adjusting to Dhaka time (GMT+6)
      const dhakaOffset = 6 * 60; // 6 hours in minutes
      const localNow = new Date(today.getTime() + (today.getTimezoneOffset() * 60000) + (dhakaOffset * 60000));
      
      const startOfDay = new Date(localNow);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(localNow);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await this.retryOperation(
        async () =>
          await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, [
            Query.greaterThanEqual("consultationDate", startOfDay.toISOString()),
            Query.lessThanEqual("consultationDate", endOfDay.toISOString()),
            Query.orderAsc("consultationDate"),
          ]),
      );

      // Enrich with patient data
      const enrichedConsultations = await Promise.all(
        response.documents.map(async (consultation) => {
          const patient = await this.getPatientById(consultation.patientId);
          return {
            ...consultation,
            patient,
            _isToday: true,
          };
        }),
      );

      return enrichedConsultations;
    } catch (error) {
      console.error("Error fetching today's consultations:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Update consultation with enhanced validation
   */
  async updateConsultation(consultationId, data) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required");
      }

      // Sanitize data
      const sanitizedData = this.sanitizeConsultationData(data);

      const updatedConsultation = await this.retryOperation(
        async () =>
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_CONSULTATIONS_COLLECTION_ID,
            consultationId,
            sanitizedData.consultationDetails, // Update only consultation details
          ),
      );

      // Update patient habits if provided and applicable (this part needs careful thought)
      // In a real-world scenario, you might have separate update methods for habits.
      // For now, assuming you want to replace/update habits associated with this consultation.
      if (sanitizedData.patientHabits.length > 0) {
        await this.updateConsultationHabits(consultationId, sanitizedData.patientHabits);
      } else {
        // If no habits are provided but there were existing ones, you might want to delete them
        await this.deleteConsultationHabits(consultationId);
      }


      // Clear cache for this specific consultation
      this.cache.delete(`consultation_${consultationId}`);

      return updatedConsultation;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Delete consultation with cascade (deletes related habits)
   */
  async deleteConsultation(consultationId) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required");
      }

      // Delete related habits first
      await this.deleteConsultationHabits(consultationId);
      console.log(`Deleted all related habits for consultation ${consultationId}`);

      // Delete the consultation itself
      await this.retryOperation(
        async () => await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, consultationId),
      );

      // Clear cache
      this.cache.delete(`consultation_${consultationId}`);

      return {
        success: true,
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error deleting consultation:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Update consultation habits (helper method for updateConsultation)
   * This function assumes replacing existing habits with the new set.
   */
  async updateConsultationHabits(consultationId, habits) {
    try {
      // 1. Delete existing habits for this consultation
      const existingHabits = await this.getConsultationHabits(consultationId);
      const deletePromises = existingHabits.map((habit) =>
        this.retryOperation(async () =>
          databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_HABITS_COLLECTION_ID, habit.$id)
        )
      );
      await Promise.all(deletePromises);
      console.log(`Deleted ${existingHabits.length} existing habits for consultation ${consultationId}`);

      // 2. Create new habits
      const createPromises = habits.map((habit) =>
        this.retryOperation(async () =>
          databases.createDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_HABITS_COLLECTION_ID, ID.unique(), {
            ...habit,
            consultationId, // Link new habit to this consultation
          })
        )
      );
      await Promise.all(createPromises);
      console.log(`Created ${habits.length} new habits for consultation ${consultationId}`);
    } catch (error) {
      console.error("Error updating consultation habits:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Delete all habits associated with a specific consultation (helper for delete/update)
   */
  async deleteConsultationHabits(consultationId) {
    try {
      const habitsToDelete = await this.getConsultationHabits(consultationId);
      const deletePromises = habitsToDelete.map(habit =>
        this.retryOperation(async () =>
          databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_HABITS_COLLECTION_ID, habit.$id)
        )
      );
      await Promise.all(deletePromises);
      return { success: true, count: habitsToDelete.length };
    } catch (error) {
      console.error(`Error deleting habits for consultation ${consultationId}:`, error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  // --- Cache Management ---
  clearCache() {
    this.cache.clear();
    console.log("Cache cleared.");
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Single instance of the service
const patientConsultationsService = new PatientConsultationsService();
export default patientConsultationsService;