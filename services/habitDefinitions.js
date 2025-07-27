import { databases } from '@/lib/appwirte/client';
import { ID, Query } from 'appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionHabitDefinitionsId = process.env.NEXT_PUBLIC_COLLECTION_HABIT_DEFINITIONS_ID;

const habitDefinitionsService = {
  async createHabitDefinition(definitionData) {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionHabitDefinitionsId,
        ID.unique(),
        definitionData
      );
      return response;
    } catch (error) {
      console.error('Error creating habit definition:', error);
      throw error;
    }
  },

  // এই ফাংশনটি এখন সমস্ত ডেটা লোড করবে, ইনফিনিটি স্ক্রল নয়।
  async getAllHabitDefinitions() { // limit, offset, searchQuery প্যারামিটার সরানো হলো
    try {
      const queries = [
        Query.orderAsc('name'), // নাম অনুযায়ী ডেটা সাজানো হবে
        Query.limit(100) // একটি যুক্তিসঙ্গত উচ্চ সীমা সেট করা হয়েছে, যাতে বেশিরভাগ ডেটা লোড হয়
      ];

      const response = await databases.listDocuments(
        databaseId,
        collectionHabitDefinitionsId,
        queries
      );

      // Appwrite থেকে আসা রেসপন্সটি সরাসরি documents অ্যারে ফেরত দেবে
      // যদি response.documents না থাকে, তাহলে একটি খালি অ্যারে ফেরত দেবে
      return response.documents || [];
    } catch (error) {
      console.error('Error getting all habit definitions:', error);
      // এখানে আরও সুনির্দিষ্ট এরর হ্যান্ডলিং থাকতে পারে, তবে প্রাথমিক অবস্থায় এরর থ্রো করবে
      throw new Error(`Failed to get all habit definitions: ${error.message || 'Unknown error'}`);
    }
  },

  // ... (বাকি service ফাংশনগুলো আগের মতোই থাকবে) ...
  async getAllActiveHabitDefinitions() {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collectionHabitDefinitionsId,
        [
          Query.equal('isActive', true),
          Query.orderAsc('name'),
          Query.limit(50)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error getting all active habit definitions:', error);
      throw new Error(`Failed to get all active habit definitions: ${error.message || error}`);
    }
  },

  async getHabitDefinitionById(id) {
    try {
      const response = await databases.getDocument(databaseId, collectionHabitDefinitionsId, id);
      return response;
    } catch (error) {
      console.error(`Error getting habit definition by ID ${id}:`, error);
      throw new Error(`Failed to get habit definition: ${error.message || error}`);
    }
  },

  async updateHabitDefinition(id, data) {
    try {
      const dataToUpdate = {
        ...data,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : Boolean(data.isActive),
      };
      const response = await databases.updateDocument(databaseId, collectionHabitDefinitionsId, id, dataToUpdate);
      return response;
    } catch (error) {
      console.error(`Error updating habit definition ${id}:`, error);
      throw new Error(`Failed to update habit definition: ${error.message || error}`);
    }
  },

  async deleteHabitDefinition(id) {
    try {
      await databases.deleteDocument(databaseId, collectionHabitDefinitionsId, id);
      return { success: true, message: "Habit definition deleted successfully." };
    } catch (error) {
      console.error(`Error deleting habit definition ${id}:`, error);
      throw new Error(`Failed to delete habit definition: ${error.message || error}`);
    }
  },
};

export default habitDefinitionsService;