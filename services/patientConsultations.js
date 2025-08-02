import { account, databases } from "@/lib/appwirte/client"; // Appwrite client import পাথ নিশ্চিত করুন
import { ID, Permission, Query, Role } from "appwrite";
import patientsService from "./patients"; // patientsService সঠিক পাথ থেকে ইম্পোর্ট করা হয়েছে ধরে নিচ্ছি


// পরিবেশ ভেরিয়েবলগুলো নিশ্চিত করুন যে সঠিকভাবে লোড হয়েছে
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID;
const APPWRITE_CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID;
const APPWRITE_PATIENT_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID; // 💡 এই ভেরিয়েবলের নাম ঠিক আছে

class PatientConsultationsService {
  constructor() {
    this.cache = new Map();
    this.retryCount = 3;
    this.retryDelay = 1000;

    // Critical: নিশ্চিত করুন সব পরিবেশ ভেরিয়েবল লোড হয়েছে
    const requiredEnvVars = [
      APPWRITE_DATABASE_ID,
      APPWRITE_PATIENTS_COLLECTION_ID,
      APPWRITE_CONSULTATIONS_COLLECTION_ID,
      APPWRITE_PATIENT_HABITS_COLLECTION_ID, // habits collection ও চেক করুন
    ];

    if (requiredEnvVars.some(v => !v)) {
      console.error("Critical Error: One or more Appwrite environment variables are not loaded!");
      console.error("Missing variables:", {
        APPWRITE_DATABASE_ID: !!APPWRITE_DATABASE_ID,
        APPWRITE_PATIENTS_COLLECTION_ID: !!APPWRITE_PATIENTS_COLLECTION_ID,
        APPWRITE_CONSULTATIONS_COLLECTION_ID: !!APPWRITE_CONSULTATIONS_COLLECTION_ID,
        APPWRITE_PATIENT_HABITS_COLLECTION_ID: !!APPWRITE_PATIENT_HABITS_COLLECTION_ID,
      });
      // Production এ এখানে throw Error করে অ্যাপ বন্ধ করে দিতে পারেন
      // throw new Error("Appwrite environment variables are missing.");
    }
  }

  // --- Utility Methods ---

  getErrorMessage(error) {
    if (error && typeof error === 'object') {
      // AppwriteException specific message
      if (error.response && typeof error.response.message === 'string') {
        return error.response.message;
      }
      // General Error object message
      if (typeof error.message === 'string') {
        return error.message;
      }
      // Appwrite error code
      if (error.code) {
        return `Appwrite Error (Code: ${error.code})`;
      }
    }
    return "An unexpected error occurred.";
  }

  async retryOperation(operation, maxRetries = this.retryCount) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        // Appwrite's 409 Conflict error should generally not be retried with the *same* ID.
        // However, if the operation itself generates a unique ID *within* the retry, it's fine.
        // Here, we specifically check for permanent errors.
        if (error.code === 409 || error.message?.includes("Document with the requested ID already exists.")) {
          // If a 409 happens, and the ID generation is outside the retry loop,
          // then retrying won't help. The `createPatientAndFirstConsultation`
          // function handles ID generation inside the retry, making this check safe.
          console.error(`Permanent Error (Code: ${error.code}): ${error.message}. Not retrying.`);
          throw error; // Don't retry on conflict with the *same* ID
        }

        // Don't retry on client-side validation, authentication, or permission errors
        if (error.message?.includes("Validation") || error.message?.includes("Unauthorized") || error.code === 400 || error.code === 401 || error.code === 403) {
          console.error(`Client/Auth Error (Code: ${error.code}): ${error.message}. Not retrying.`);
          throw error;
        }

        if (attempt === maxRetries) {
          console.error(`Operation failed after ${maxRetries} attempts.`);
          throw error; // Last attempt, re-throw the error
        }

        const delay = this.retryDelay * attempt;
        console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms... Error: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Sanitizes and structures form data for Appwrite storage.
   * @param {Object} data - Raw form data.
   * @returns {Object} Sanitized data for patient, consultation, and habits.
   */
  sanitizeConsultationData(data) {
    const patientDetails = data.patientDetails || {};
    const consultationDetails = data.consultationDetails || {};
    const prescription = data.prescription || {};
    const habitsAndHistory = data.habitsAndHistory || {};
    const patientHabits = data.patientHabits || [];

    const sanitizedPatientDetails = {
      name: patientDetails.name?.trim() || "",
      age: Number(patientDetails.age) || 0,
      gender: patientDetails.gender || "Other",
      phoneNumber: patientDetails.phoneNumber?.trim() || "",
      serialNumber: patientDetails.serialNumber?.trim() || "",
      address: patientDetails.address?.trim() || null,
      occupation: patientDetails.occupation?.trim() || null,
      bloodGroup: patientDetails.bloodGroup?.trim() || null,
      notes: patientDetails.notes?.trim() || null,
      // Ensure date formats are ISO strings or null
      dob: patientDetails.dob ? new Date(patientDetails.dob).toISOString() : null,
      // firstConsultationDate is set during the createPatientAndFirstConsultation flow
      firstConsultationDate: new Date(consultationDetails.consultationDate || Date.now()).toISOString(),
    };

    const sanitizedConsultationDetails = {
      consultationDate: new Date(consultationDetails.consultationDate || Date.now()).toISOString(),
      chamberId: consultationDetails.chamberId?.trim() || "",
      chiefComplaint: (consultationDetails.chiefComplaint || []).filter((c) => c?.trim()),
      diagnosis: (consultationDetails.diagnosis || []).filter((d) => d?.trim()),
      otherComplaints: (consultationDetails.otherComplaints || []).filter((c) => c?.trim()),

      prescriptions: (prescription.medicines || [])
        .map(med => med.name?.trim() || '')
        .filter(Boolean), // Filters out empty strings

      dosageInstructions: (prescription.dosageInstructions || [])
        .map((instruction) => {
          if (typeof instruction === "object" && (instruction.predefinedInstruction || instruction.customInstruction)) {
            return (instruction.predefinedInstruction || instruction.customInstruction)?.trim();
          }
          return typeof instruction === "string" ? instruction.trim() : "";
        })
        .filter(Boolean),

      prescriptionNotes: prescription.prescriptionNotes?.trim() || null,

      dietAndLifestyleAdvice: (consultationDetails.advice && consultationDetails.advice.trim())
        ? [consultationDetails.advice.trim()]
        : [],

      followUpDate: consultationDetails.followUpDate
        ? new Date(consultationDetails.followUpDate).toISOString()
        : null,
      symptoms: consultationDetails.symptoms?.trim() || null,
      BP: consultationDetails.BP?.trim() || null,
      Pulse: consultationDetails.Pulse?.trim() || null,
      Temp: consultationDetails.Temp?.trim() || null,
      historyOfPresentIllness: consultationDetails.historyOfPresentIllness?.trim() || null,
      // Combine familyHistory from consultationDetails or habitsAndHistory, preferring consultationDetails
      familyHistory: (consultationDetails.familyHistory?.trim() || habitsAndHistory.familyHistory?.trim()) || null,
      O_E: consultationDetails.O_E?.trim() || null,
      notes: consultationDetails.notes?.trim() || null,
      billAmount: Number(consultationDetails.billAmount) || 0,
    };

    const sanitizedPatientHabits = (habitsAndHistory.patientHabits || patientHabits)
      .filter((habit) => habit.habitDefinitionId && habit.value)
      .map((habit) => ({
        habitDefinitionId: habit.habitDefinitionId,
        value: habit.value?.trim(),
        notes: habit.notes?.trim() || null,
        recordedDate: new Date().toISOString(),
      }));

    return {
      patientDetails: sanitizedPatientDetails,
      consultationDetails: sanitizedConsultationDetails,
      patientHabits: sanitizedPatientHabits,
    };
  }

  // ========================================== Core CRUD Operations ==========================================

  /**
   * Create a new consultation record.
   * Used for follow-up consultations.
   * @param {Object} consultationData - Data for the consultation.
   * @returns {Promise<Object>} The created consultation document.
   */
  async createConsultation(consultationData) {
    if (!consultationData) {
      throw new Error("Consultation data is required to create a consultation.");
    }
    try {
      const currentUser = await account.get();
      const userPermissions = [
        Permission.read(Role.user(currentUser.$id)),
        Permission.update(Role.user(currentUser.$id)),
        Permission.delete(Role.user(currentUser.$id)),
      ];

      const newConsultation = await this.retryOperation(async () => {
        const consultationUniqueId = ID.unique();
        console.log("DEBUG: ID for Standalone Consultation creation:", consultationUniqueId);
        return await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONSULTATIONS_COLLECTION_ID,
          consultationUniqueId,
          consultationData,
          userPermissions
        );
      });
      console.log("Appwrite: Consultation document created.", newConsultation.$id);
      return newConsultation;
    } catch (error) {
      console.error('Error creating consultation document:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Creates a new patient and their first consultation.
   * This is the primary function for a new patient registration.
   * @param {Object} fullFormData - Complete form data for patient and consultation.
   * @returns {Promise<Object>} Object containing the created patient, consultation, and habits.
   * @throws {Error} If patient creation or consultation creation fails.
   */
  async createPatientAndFirstConsultation(fullFormData) {
    let patientId = null;
    let consultationId = null;
    try {
      console.log("🚀 Starting patient and consultation creation...");

      const sanitizedData = this.sanitizeConsultationData(fullFormData);
      console.log("✅ Data sanitization completed.");

      const currentUser = await account.get();
      const userPermissions = [
        Permission.read(Role.user(currentUser.$id)),
        Permission.update(Role.user(currentUser.$id)),
        Permission.delete(Role.user(currentUser.$id)),
      ];

      // 1. Check for duplicate patient (by serial number and phone number)
      // We assume patientsService.searchPatientsBySerialNumber and searchPatientsByPhoneNumber exist
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
        const currentPatientId = ID.unique(); // New unique ID for patient
        console.log("DEBUG: ID for Patient creation:", currentPatientId);
        return await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_PATIENTS_COLLECTION_ID,
          currentPatientId,
          sanitizedData.patientDetails,
          userPermissions
        );
      });
      console.log("✅ Patient created:", newPatient.$id);
      patientId = newPatient.$id;

      // 3. Prepare consultation data (link with new patient ID)
      const consultationDataToSave = {
        ...sanitizedData.consultationDetails,
        patientId: patientId, // Link consultation to the newly created patient
      };

      // 4. Create the first consultation
      const newConsultation = await this.retryOperation(async () => {
        console.log("📝 Creating consultation...");
        const currentConsultationId = ID.unique(); // New unique ID for consultation
        console.log("DEBUG: ID for Consultation creation:", currentConsultationId);
        return await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONSULTATIONS_COLLECTION_ID,
          currentConsultationId,
          consultationDataToSave,
          userPermissions
        );
      });
      console.log("✅ Consultation created:", newConsultation.$id);
      consultationId = newConsultation.$id;

      // 5. Save patient habits if any
      let createdHabits = [];
      if (sanitizedData.patientHabits && sanitizedData.patientHabits.length > 0 && APPWRITE_PATIENT_HABITS_COLLECTION_ID) {
        console.log(`📝 Creating ${sanitizedData.patientHabits.length} patient habits...`);

        const habitPromises = sanitizedData.patientHabits.map((habit) =>
          this.retryOperation(
            async () => {
              const currentHabitId = ID.unique(); // New unique ID for each habit
              console.log("DEBUG: ID for Habit creation:", currentHabitId);
              return await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_PATIENT_HABITS_COLLECTION_ID, // 💡 সঠিক ভেরিয়েবলের নাম
                currentHabitId,
                {
                  ...habit,
                  patientId: patientId,
                  consultationId: consultationId,
                },
                userPermissions
              );
            }
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
      // If consultation creation fails but patient was created, clean up the patient record
      if (patientId && !consultationId) {
        console.warn(`🗑️ Cleaning up partially created patient ${patientId} due to consultation creation failure.`);
        try {
          await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENTS_COLLECTION_ID, patientId);
          console.log(`✅ Patient ${patientId} deleted successfully during cleanup.`);
        } catch (cleanupError) {
          console.error(`❌ Failed to clean up patient ${patientId}:`, cleanupError);
        }
      }

      const enhancedError = new Error(this.getErrorMessage(error));
      enhancedError.originalError = error;
      enhancedError.context = { fullFormData, timestamp: new Date().toISOString(), patientIdAttempted: patientId };
      throw enhancedError;
    }
  }

  /**
   * Get all consultations with filtering and pagination.
   * @param {Object} [filters={}] - Filtering and pagination options.
   * @param {string} [filters.patientId] - Filter by patient ID.
   * @param {string} [filters.chamberId] - Filter by chamber ID.
   * @param {string} [filters.startDate] - Start date for consultationDate (ISO string).
   * @param {string} [filters.endDate] - End date for consultationDate (ISO string).
   * @param {number} [filters.limit=100] - Number of documents to return.
   * @param {number} [filters.offset=0] - Offset for pagination.
   * @returns {Promise<Object>} Paginated list of consultations.
   */
  async getAllConsultations(filters = {}) {
    try {
      const queries = [Query.orderDesc("consultationDate")];

      // Add filters dynamically
      if (filters.patientId) queries.push(Query.equal("patientId", filters.patientId));
      if (filters.chamberId) queries.push(Query.equal("chamberId", filters.chamberId));
      if (filters.startDate) queries.push(Query.greaterThanEqual("consultationDate", filters.startDate));
      if (filters.endDate) queries.push(Query.lessThanEqual("consultationDate", filters.endDate));

      // Pagination
      queries.push(Query.limit(filters.limit || 100)); // Default limit
      if (filters.offset) queries.push(Query.offset(filters.offset));

      const response = await this.retryOperation(
        async () => await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, queries),
      );

      return {
        documents: response.documents,
        total: response.total,
        hasMore: response.documents.length === (filters.limit || 100) && (response.total > (filters.offset || 0) + response.documents.length),
      };
    } catch (error) {
      console.error("Error fetching consultations:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get consultation by ID with related patient and habits data.
   * @param {string} consultationId - The ID of the consultation.
   * @returns {Promise<Object>} The enriched consultation document.
   * @throws {Error} If consultation ID is missing or fetch fails.
   */
  async getConsultationById(consultationId) {
    if (!consultationId) {
      throw new Error("Consultation ID is required");
    }

    // Check cache first
    const cacheKey = `consultation_${consultationId}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // Cache valid for 5 minutes (300,000 ms)
      if (Date.now() - cached.timestamp < 300000) {
        console.log(`Cache hit for consultation ${consultationId}`);
        return cached.data;
      } else {
        console.log(`Cache expired for consultation ${consultationId}`);
        this.cache.delete(cacheKey); // Remove expired cache
      }
    }

    try {
      const consultation = await this.retryOperation(
        async () => await databases.getDocument(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, consultationId),
      );

      // Get related patient data using patientsService
      const patient = await patientsService.getPatientById(consultation.patientId)
        .catch(err => {
          console.warn(`Could not fetch patient data for ID ${consultation.patientId}:`, err.message);
          return null; // Return null if patient not found, don't throw
        });

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
          cached: false, // Indicate it's not from cache on first fetch
        },
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: { ...enrichedConsultation, _metadata: { ...enrichedConsultation._metadata, cached: true } }, // Mark as cached
        timestamp: Date.now(),
      });

      return enrichedConsultation;
    } catch (error) {
      console.error("Error fetching consultation:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get patient by ID using patientsService (moved for modularity).
   * This function should ideally be in patientsService.js
   * @param {string} patientId - The ID of the patient.
   * @returns {Promise<Object|null>} The patient document or null if not found.
   */
  async getPatientById(patientId) {
    // 💡 This method ideally belongs in patientsService.js
    // Re-directing call to patientsService assuming it has this method.
    return await patientsService.getPatientById(patientId);
  }

  /**
   * Get consultation habits.
   * @param {string} consultationId - The ID of the consultation.
   * @returns {Promise<Array>} List of habit documents.
   */
  async getConsultationHabits(consultationId) {
    try {
      const response = await this.retryOperation(
        async () =>
          await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_PATIENT_HABITS_COLLECTION_ID, [ // 💡 সঠিক ভেরিয়েবলের নাম
            Query.equal("consultationId", consultationId),
            Query.limit(100), // Add a limit for habits too
          ]),
      );
      return response.documents;
    } catch (error) {
      console.warn("Could not fetch consultation habits:", error.message);
      return [];
    }
  }

  /**
   * Get consultations by patient ID with pagination.
   * @param {string} patientId - The ID of the patient.
   * @param {Object} [options={}] - Pagination options (limit, offset).
   * @returns {Promise<Object>} Paginated list of patient's consultations.
   */
  async getConsultationsByPatientId(patientId, options = {}) {
    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    try {
      const queries = [
        Query.equal("patientId", patientId),
        Query.orderDesc("consultationDate"),
        Query.limit(options.limit || 100),
      ];

      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await this.retryOperation(
        async () => await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, queries),
      );

      return {
        consultations: response.documents,
        total: response.total,
        hasMore: response.documents.length === (options.limit || 100) && (response.total > (options.offset || 0) + response.documents.length),
      };
    } catch (error) {
      console.error("Error fetching patient consultations:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Get today's consultations.
   * Includes patient data.
   * @returns {Promise<Array>} List of today's enriched consultations.
   */
  async getTodayConsultations() {
    try {
      const today = new Date();
      // Adjusting to Dhaka time (GMT+6) to ensure correct "today" regardless of server timezone
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
            Query.limit(100), // Default limit for today's consultations
          ]),
      );

      // Enrich with patient data
      const enrichedConsultations = await Promise.all(
        response.documents.map(async (consultation) => {
          const patient = await this.getPatientById(consultation.patientId); // Uses patientsService.getPatientById
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
   * Update consultation with enhanced validation and optional habit updates.
   * @param {string} consultationId - The ID of the consultation to update.
   * @param {Object} data - The data to update (can contain consultationDetails and patientHabits).
   * @returns {Promise<Object>} The updated consultation document.
   * @throws {Error} If consultation ID is missing or update fails.
   */
  async updateConsultation(consultationId, data) {
    if (!consultationId) {
      throw new Error("Consultation ID is required for update.");
    }
    try {
      const sanitizedData = this.sanitizeConsultationData(data); // Re-sanitize for updates

      const updatedConsultation = await this.retryOperation(
        async () =>
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_CONSULTATIONS_COLLECTION_ID,
            consultationId,
            sanitizedData.consultationDetails, // Update only consultation details fields
          ),
      );

      // Handle patient habits update:
      // This logic replaces existing habits for the consultation with the new set.
      // If you want to merge or partially update, this logic needs to change.
      if (sanitizedData.patientHabits && APPWRITE_PATIENT_HABITS_COLLECTION_ID) {
        await this.updateConsultationHabits(updatedConsultation.$id, sanitizedData.patientHabits);
      }

      // Clear cache for this specific consultation to ensure fresh data on next fetch
      this.cache.delete(`consultation_${consultationId}`);

      return updatedConsultation;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw new new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Delete consultation with cascade (deletes related habits).
   * @param {string} consultationId - The ID of the consultation to delete.
   * @returns {Promise<Object>} Success status.
   * @throws {Error} If consultation ID is missing or deletion fails.
   */
  async deleteConsultation(consultationId) {
    if (!consultationId) {
      throw new Error("Consultation ID is required for deletion.");
    }
    try {
      // Delete related habits first to maintain data integrity
      await this.deleteConsultationHabits(consultationId);
      console.log(`Deleted all related habits for consultation ${consultationId}`);

      // Delete the consultation itself
      await this.retryOperation(
        async () => await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_CONSULTATIONS_COLLECTION_ID, consultationId),
      );

      // Clear cache for the deleted consultation
      this.cache.delete(`consultation_${consultationId}`);

      return {
        success: true,
        deletedConsultationId: consultationId,
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error deleting consultation:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Update consultation habits. This function assumes replacing existing habits with the new set.
   * @param {string} consultationId - The consultation ID to link habits to.
   * @param {Array<Object>} habits - Array of habit objects to create/update.
   * @returns {Promise<void>}
   * @throws {Error} If habit update fails.
   */
  async updateConsultationHabits(consultationId, habits) {
    if (!APPWRITE_PATIENT_HABITS_COLLECTION_ID) {
      console.warn("APPWRITE_PATIENT_HABITS_COLLECTION_ID is not set. Skipping habit update.");
      return;
    }
    try {
      // 1. Delete existing habits for this consultation
      const existingHabits = await this.getConsultationHabits(consultationId);
      const deletePromises = existingHabits.map((habit) =>
        this.retryOperation(async () =>
          databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENT_HABITS_COLLECTION_ID, habit.$id) // 💡 সঠিক ভেরিয়েবলের নাম
        )
      );
      await Promise.all(deletePromises);
      console.log(`Deleted ${existingHabits.length} existing habits for consultation ${consultationId}`);

      // 2. Create new habits
      const createPromises = habits.map((habit) =>
        this.retryOperation(async () =>
          databases.createDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENT_HABITS_COLLECTION_ID, ID.unique(), { // 💡 সঠিক ভেরিয়েবলের নাম
            ...habit,
            patientId: habit.patientId, // Assuming habit object has patientId, or you might need to fetch it from consultation
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
   * Delete all habits associated with a specific consultation.
   * @param {string} consultationId - The ID of the consultation.
   * @returns {Promise<Object>} Success status and count of deleted habits.
   * @throws {Error} If habit deletion fails.
   */
  async deleteConsultationHabits(consultationId) {
    if (!APPWRITE_PATIENT_HABITS_COLLECTION_ID) {
      console.warn("APPWRITE_PATIENT_HABITS_COLLECTION_ID is not set. Skipping habit deletion.");
      return { success: true, count: 0 };
    }
    try {
      const habitsToDelete = await this.getConsultationHabits(consultationId);
      const deletePromises = habitsToDelete.map(habit =>
        this.retryOperation(async () =>
          databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_PATIENT_HABITS_COLLECTION_ID, habit.$id) // 💡 সঠিক ভেরিয়েবলের নাম
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
  /**
   * Clears all cached consultation data.
   */
  clearCache() {
    this.cache.clear();
    console.log("Cache cleared.");
  }

  /**
   * Gets statistics about the current cache.
   * @returns {Object} Cache size and keys.
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Single instance of the service for consistent behavior
const patientConsultationsService = new PatientConsultationsService();
export default patientConsultationsService;