// services/patientHabits.js
import { databases } from '@/lib/appwirte/client';
import { Query, ID } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const PATIENT_HABITS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID; // নিশ্চিত করুন আপনার ENV ভেরিয়েবলটি সঠিক

const patientHabitsService = {
  /**
   * Fetches all habit entries for a specific patient.
   * @param {string} patientId - The ID of the patient.
   * @returns {Promise<Array<Object>>} An array of patient habit documents.
   */
  async getPatientHabitsByPatientId(patientId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENT_HABITS_COLLECTION_ID,
        [Query.equal('patientId', patientId), Query.orderAsc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error(`Error fetching habits for patient ${patientId}:`, error);
      throw new Error(`Failed to retrieve patient habits: ${error.message || error}`);
    }
  },

  /**
   * Creates a new patient habit entry.
   * @param {Object} habitData - The data for the new habit entry (must include patientId).
   * @returns {Promise<Object>} The newly created habit document.
   */
  async createPatientHabit(habitData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        PATIENT_HABITS_COLLECTION_ID,
        ID.unique(),
        habitData
      );
      return response;
    } catch (error) {
      console.error('Error creating patient habit:', error);
      throw new Error(`Failed to create patient habit: ${error.message || error}`);
    }
  },

  /**
   * Updates an existing patient habit entry.
   * @param {string} habitId - The ID of the habit entry to update.
   * @param {Object} habitData - The data to update.
   * @returns {Promise<Object>} The updated habit document.
   */
  async updatePatientHabit(habitId, habitData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        PATIENT_HABITS_COLLECTION_ID,
        habitId,
        habitData
      );
      return response;
    } catch (error) {
      console.error(`Error updating patient habit ${habitId}:`, error);
      throw new Error(`Failed to update patient habit: ${error.message || error}`);
    }
  },

  /**
   * Deletes a patient habit entry.
   * @param {string} habitId - The ID of the habit entry to delete.
   * @returns {Promise<boolean>} True if successful.
   */
  async deletePatientHabit(habitId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PATIENT_HABITS_COLLECTION_ID,
        habitId
      );
      return true;
    } catch (error) {
      console.error(`Error deleting patient habit ${habitId}:`, error);
      throw new Error(`Failed to delete patient habit: ${error.message || error}`);
    }
  },

  // A helper function to manage an array of habits (create, update, delete)
  // This is a more complex logic, depending on how your habits are structured
  async updatePatientHabits(patientId, updatedHabitsArray) {
    // This function's implementation depends heavily on how you track changes.
    // For simplicity, let's assume we delete all existing for this patient and recreate.
    // In a real app, you'd compare current habits with updatedHabitsArray and
    // perform targeted create/update/delete operations.

    // 1. Fetch current habits for this patient
    const currentHabits = await this.getPatientHabitsByPatientId(patientId);
    const currentHabitIds = new Set(currentHabits.map(h => h.$id));
    const updatedHabitIds = new Set(updatedHabitsArray.map(h => h.$id).filter(id => id)); // Filter out new habits without ID

    const promises = [];

    // 2. Delete habits that are no longer in updatedHabitsArray
    for (const currentHabit of currentHabits) {
      if (!updatedHabitIds.has(currentHabit.$id)) {
        promises.push(this.deletePatientHabit(currentHabit.$id));
      }
    }

    // 3. Create or Update habits
    for (const updatedHabit of updatedHabitsArray) {
      if (updatedHabit.$id && currentHabitIds.has(updatedHabit.$id)) {
        // Update existing habit
        promises.push(this.updatePatientHabit(updatedHabit.$id, updatedHabit));
      } else {
        // Create new habit (ensure patientId is attached)
        promises.push(this.createPatientHabit({ ...updatedHabit, patientId: patientId }));
      }
    }

    await Promise.all(promises);
    return true;
  }
};

export default patientHabitsService;