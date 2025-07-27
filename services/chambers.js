
import { databases } from '@/lib/appwirte/client';
import { Query, ID } from 'appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionChambersId = process.env.NEXT_PUBLIC_COLLECTION_CHAMBERS_ID; 

export const chamberService = {
  async createChamber(chamberData) {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionChambersId,
        ID.unique(),
        chamberData
      );
      return response;
    } catch (error) {
      console.error('Error creating chamber:', error);
      throw error;
    }
  },

  async getAllChambers() {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collectionChambersId,
        [Query.limit(100)] // Adjust limit as needed
      );
      return response.documents;
    } catch (error) {
      console.error('Failed to get all chambers:', error);
      throw error;
    }
  },

  async getChamberById(chamberId) {
    try {
      const response = await databases.getDocument(databaseId, collectionChambersId, chamberId);
      return response;
    } catch (error) {
      console.error(`Failed to get chamber by ID ${chamberId}:`, error);
      throw error;
    }
  },

  async updateChamber(chamberId, chamberData) {
    try {
      const response = await databases.updateDocument(databaseId, collectionChambersId, chamberId, chamberData);
      return response;
    } catch (error) {
      console.error(`Failed to update chamber with ID ${chamberId}:`, error);
      throw error;
    }
  },

  async deleteChamber(chamberId) {
    try {
      const response = await databases.deleteDocument(databaseId, collectionChambersId, chamberId);
      return response;
    } catch (error) {
      console.error(`Failed to delete chamber with ID ${chamberId}:`, error);
      throw error;
    }
  },
};