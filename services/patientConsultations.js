import { databases } from "@/lib/appwirte/client"
import { ID, Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const PATIENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID
const CONSULTATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID
const PATIENTS_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID

class PatientConsultationsService {
  constructor() {
    this.cache = new Map()
    this.retryCount = 3
    this.retryDelay = 1000
  }

  // ========================================== Validation Methods ==========================================
  /**
   * Validate consultation data before creation
   */
  async validateConsultationData(data) {
    const errors = []

    // Validate patient details
    if (!data.patientDetails?.name?.trim()) {
      errors.push("Patient name is required")
    }
    if (!data.patientDetails?.age || data.patientDetails.age < 1) {
      errors.push("Valid patient age is required")
    }
    if (!data.patientDetails?.phoneNumber?.trim()) {
      errors.push("Patient phone number is required")
    }
    if (!data.patientDetails?.serialNumber?.trim()) {
      errors.push("Patient serial number is required")
    }

    // Validate consultation details
    if (!data.consultationDetails?.consultationDate) {
      errors.push("Consultation date is required")
    }
    if (!data.consultationDetails?.chamberId) {
      errors.push("Chamber selection is required")
    }
    if (!data.consultationDetails?.chiefComplaint?.some((c) => c.trim())) {
      errors.push("At least one chief complaint is required")
    }
    if (!data.consultationDetails?.diagnosis?.some((d) => d.trim())) {
      errors.push("At least one diagnosis is required")
    }

    // Validate patient habits
    if (data.patientHabits?.length > 0) {
      data.patientHabits.forEach((habit, index) => {
        if (!habit.habitDefinitionId) {
          errors.push(`Habit ${index + 1}: Habit type is required`)
        }
        if (!habit.value?.trim()) {
          errors.push(`Habit ${index + 1}: Value is required`)
        }
      })
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`)
    }

    return true
  }

  /**
   * Sanitize and transform data for Appwrite
   */
  sanitizeConsultationData(data) {
    return {
      patientDetails: {
        ...data.patientDetails,
        name: data.patientDetails.name?.trim(),
        phoneNumber: data.patientDetails.phoneNumber?.trim(),
        address: data.patientDetails.address?.trim() || null,
        occupation: data.patientDetails.occupation?.trim() || null,
        serialNumber: data.patientDetails.serialNumber?.trim(),
        bloodGroup: data.patientDetails.bloodGroup?.trim() || null,
        notes: data.patientDetails.notes?.trim() || null,
        dob: data.patientDetails.dob ? new Date(data.patientDetails.dob).toISOString() : null,
        firstConsultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
      },
      consultationDetails: {
        ...data.consultationDetails,
        consultationDate: new Date(data.consultationDetails.consultationDate).toISOString(),
        followUpDate: data.consultationDetails.followUpDate
          ? new Date(data.consultationDetails.followUpDate).toISOString()
          : null,
        chiefComplaint: data.consultationDetails.chiefComplaint.filter((c) => c.trim()),
        diagnosis: data.consultationDetails.diagnosis.filter((d) => d.trim()),
        prescriptions: (data.consultationDetails.prescriptions || [])
          .filter((p) => p.medicineId)
          .map((p) => p.medicineId), // Convert to medicine ID strings for Appwrite
        dosageInstructions: (data.consultationDetails.dosageInstructions || [])
          .filter((i) => i.trim())
          .map((instruction) => {
            // Handle both predefined and custom instructions
            if (typeof instruction === "object") {
              return instruction.predefinedInstruction || instruction.customInstruction || ""
            }
            return instruction
          }),
        dietAndLifestyleAdvice: (data.consultationDetails.dietAndLifestyleAdvice || []).filter((a) => a.trim()),
        otherComplaints: (data.consultationDetails.otherComplaints || []).filter((c) => c.trim()),
        symptoms: data.consultationDetails.symptoms?.trim() || null,
        BP: data.consultationDetails.BP?.trim() || null,
        Pulse: data.consultationDetails.Pulse?.trim() || null,
        Temp: data.consultationDetails.Temp?.trim() || null,
        historyOfPresentIllness: data.consultationDetails.historyOfPresentIllness?.trim() || null,
        familyHistory: data.consultationDetails.familyHistory?.trim() || null,
        O_E: data.consultationDetails.O_E?.trim() || null,
        prescriptionNotes: data.consultationDetails.prescriptionNotes?.trim() || null,
        notes: data.consultationDetails.notes?.trim() || null,
        billAmount: data.consultationDetails.billAmount || 0,
      },
      patientHabits: (data.patientHabits || [])
        .filter((habit) => habit.habitDefinitionId && habit.value)
        .map((habit) => ({
          ...habit,
          value: habit.value.trim(),
          notes: habit.notes?.trim() || null,
          recordedDate: new Date().toISOString(),
        })),
    }
  }

  // ========================================== Error Handling ==========================================
  getErrorMessage(error) {
    if (error.message?.includes("Document with the requested ID could not be found")) {
      return "The requested record was not found"
    }
    if (error.message?.includes("Validation")) {
      return error.message
    }
    if (error.message?.includes("Network")) {
      return "Network error. Please check your connection"
    }
    if (error.message?.includes("Unauthorized")) {
      return "You are not authorized to perform this action"
    }
    return error.message || "An unexpected error occurred"
  }

  async retryOperation(operation, maxRetries = this.retryCount) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }

        // Don't retry on validation or authorization errors
        if (error.message?.includes("Validation") || error.message?.includes("Unauthorized")) {
          throw error
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt))
      }
    }
  }

  // ========================================== Core CRUD Operations ==========================================
  /**
   * Create patient and first consultation with enhanced error handling and transactions
   */
  async createPatientAndFirstConsultation(data) {
    try {
      console.log("🚀 Starting patient and consultation creation...")

      // Validate input data
      await this.validateConsultationData(data)
      console.log("✅ Data validation passed")

      // Sanitize data
      const sanitizedData = this.sanitizeConsultationData(data)
      console.log("✅ Data sanitization completed")

      // Create patient first
      const newPatient = await this.retryOperation(async () => {
        console.log("📝 Creating patient...")
        return await databases.createDocument(
          DATABASE_ID,
          PATIENTS_COLLECTION_ID,
          ID.unique(),
          sanitizedData.patientDetails,
        )
      })
      console.log("✅ Patient created:", newPatient.$id)

      // Create consultation
      const consultationData = {
        ...sanitizedData.consultationDetails,
        patientId: newPatient.$id,
      }

      const newConsultation = await this.retryOperation(async () => {
        console.log("📝 Creating consultation...")
        return await databases.createDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, ID.unique(), consultationData)
      })
      console.log("✅ Consultation created:", newConsultation.$id)

      // Create patient habits if any
      let createdHabits = []
      if (sanitizedData.patientHabits.length > 0) {
        console.log(`📝 Creating ${sanitizedData.patientHabits.length} patient habits...`)

        const habitPromises = sanitizedData.patientHabits.map((habit) =>
          this.retryOperation(
            async () =>
              await databases.createDocument(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, ID.unique(), {
                ...habit,
                patientId: newPatient.$id,
                consultationId: newConsultation.$id,
              }),
          ),
        )

        createdHabits = await Promise.all(habitPromises)
        console.log(`✅ ${createdHabits.length} habits created`)
      }

      // Return complete result
      const result = {
        newPatient,
        newConsultation,
        createdHabits,
        summary: {
          patientId: newPatient.$id,
          consultationId: newConsultation.$id,
          habitsCount: createdHabits.length,
          createdAt: new Date().toISOString(),
        },
      }

      console.log("🎉 Patient and consultation creation completed successfully")
      return result
    } catch (error) {
      console.error("❌ Error in createPatientAndFirstConsultation:", error)

      // Enhanced error context
      const enhancedError = new Error(this.getErrorMessage(error))
      enhancedError.originalError = error
      enhancedError.context = { data, timestamp: new Date().toISOString() }

      throw enhancedError
    }
  }

  /**
   * Get all consultations with filtering and pagination
   */
  async getAllConsultations(filters = {}) {
    try {
      const queries = [Query.orderDesc("consultationDate")]

      // Add filters
      if (filters.patientId) {
        queries.push(Query.equal("patientId", filters.patientId))
      }
      if (filters.chamberId) {
        queries.push(Query.equal("chamberId", filters.chamberId))
      }
      if (filters.startDate) {
        queries.push(Query.greaterThanEqual("consultationDate", filters.startDate))
      }
      if (filters.endDate) {
        queries.push(Query.lessThanEqual("consultationDate", filters.endDate))
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit))
      } else {
        queries.push(Query.limit(100)) // Default limit
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset))
      }

      const response = await this.retryOperation(
        async () => await databases.listDocuments(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, queries),
      )

      return {
        documents: response.documents,
        total: response.total,
        hasMore: response.documents.length === (filters.limit || 100),
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Get consultation by ID with related data
   */
  async getConsultationById(consultationId) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required")
      }

      // Check cache first
      const cacheKey = `consultation_${consultationId}`
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)
        if (Date.now() - cached.timestamp < 300000) {
          // 5 minutes cache
          return cached.data
        }
      }

      const consultation = await this.retryOperation(
        async () => await databases.getDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, consultationId),
      )

      // Get related patient data
      const patient = await this.getPatientById(consultation.patientId)

      // Get patient habits for this consultation
      const habits = await this.getConsultationHabits(consultationId)

      const enrichedConsultation = {
        ...consultation,
        patient,
        habits,
        _metadata: {
          hasPatient: !!patient,
          habitsCount: habits.length,
          fetchedAt: new Date().toISOString(),
        },
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: enrichedConsultation,
        timestamp: Date.now(),
      })

      return enrichedConsultation
    } catch (error) {
      console.error("Error fetching consultation:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Get patient by ID (helper method)
   */
  async getPatientById(patientId) {
    try {
      return await this.retryOperation(
        async () => await databases.getDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, patientId),
      )
    } catch (error) {
      console.warn("Could not fetch patient data:", error)
      return null
    }
  }

  /**
   * Get consultation habits (helper method)
   */
  async getConsultationHabits(consultationId) {
    try {
      const response = await this.retryOperation(
        async () =>
          await databases.listDocuments(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, [
            Query.equal("consultationId", consultationId),
          ]),
      )
      return response.documents
    } catch (error) {
      console.warn("Could not fetch consultation habits:", error)
      return []
    }
  }

  /**
   * Get consultations by patient ID with pagination
   */
  async getConsultationsByPatientId(patientId, options = {}) {
    try {
      if (!patientId) {
        throw new Error("Patient ID is required")
      }

      const queries = [Query.equal("patientId", patientId), Query.orderDesc("consultationDate")]

      if (options.limit) {
        queries.push(Query.limit(options.limit))
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset))
      }

      const response = await this.retryOperation(
        async () => await databases.listDocuments(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, queries),
      )

      return {
        consultations: response.documents,
        total: response.total,
        hasMore: response.documents.length === (options.limit || response.documents.length),
      }
    } catch (error) {
      console.error("Error fetching patient consultations:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Get today's consultations
   */
  async getTodayConsultations() {
    try {
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

      const response = await this.retryOperation(
        async () =>
          await databases.listDocuments(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, [
            Query.greaterThanEqual("consultationDate", startOfDay),
            Query.lessThanEqual("consultationDate", endOfDay),
            Query.orderAsc("consultationDate"),
          ]),
      )

      // Enrich with patient data
      const enrichedConsultations = await Promise.all(
        response.documents.map(async (consultation) => {
          const patient = await this.getPatientById(consultation.patientId)
          return {
            ...consultation,
            patient,
            _isToday: true,
          }
        }),
      )

      return enrichedConsultations
    } catch (error) {
      console.error("Error fetching today's consultations:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Update consultation with enhanced validation
   */
  async updateConsultation(consultationId, data) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required")
      }

      // Validate update data
      await this.validateConsultationData(data)

      // Sanitize data
      const sanitizedData = this.sanitizeConsultationData(data)

      const updatedConsultation = await this.retryOperation(
        async () =>
          await databases.updateDocument(
            DATABASE_ID,
            CONSULTATIONS_COLLECTION_ID,
            consultationId,
            sanitizedData.consultationDetails,
          ),
      )

      // Update patient habits if provided
      if (sanitizedData.patientHabits.length > 0) {
        await this.updateConsultationHabits(consultationId, sanitizedData.patientHabits)
      }

      // Clear cache
      this.cache.delete(`consultation_${consultationId}`)

      return updatedConsultation
    } catch (error) {
      console.error("Error updating consultation:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Delete consultation with cascade
   */
  async deleteConsultation(consultationId) {
    try {
      if (!consultationId) {
        throw new Error("Consultation ID is required")
      }

      // Delete related habits first
      const habits = await this.getConsultationHabits(consultationId)
      const habitDeletePromises = habits.map((habit) =>
        databases.deleteDocument(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, habit.$id),
      )

      await Promise.all(habitDeletePromises)
      console.log(`Deleted ${habits.length} related habits`)

      // Delete the consultation
      await this.retryOperation(
        async () => await databases.deleteDocument(DATABASE_ID, CONSULTATIONS_COLLECTION_ID, consultationId),
      )

      // Clear cache
      this.cache.delete(`consultation_${consultationId}`)

      return {
        success: true,
        deletedHabits: habits.length,
        deletedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error deleting consultation:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Clear cache method
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Update consultation habits
   */
  async updateConsultationHabits(consultationId, habits) {
    try {
      // Delete existing habits
      const existingHabits = await this.getConsultationHabits(consultationId)
      const deletePromises = existingHabits.map((habit) =>
        databases.deleteDocument(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, habit.$id),
      )
      await Promise.all(deletePromises)
      console.log(`Deleted ${existingHabits.length} existing habits`)

      // Create new habits
      const createPromises = habits.map((habit) =>
        databases.createDocument(DATABASE_ID, PATIENTS_HABITS_COLLECTION_ID, ID.unique(), {
          ...habit,
          consultationId,
        }),
      )
      await Promise.all(createPromises)
      console.log(`Created ${habits.length} new habits`)
    } catch (error) {
      console.error("Error updating consultation habits:", error)
      throw new Error(this.getErrorMessage(error))
    }
  }
}

const patientConsultationsService = new PatientConsultationsService()
export default patientConsultationsService
