import { databases } from '@/lib/appwirte/client';
import { ID, Query } from 'appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionMedicinesId = process.env.NEXT_PUBLIC_COLLECTION_MEDICINES_ID;

const medicineService = {

    async createMedicine(medicineData) {
        try {
            const response = await databases.createDocument(
                databaseId,
                collectionMedicinesId,
                ID.unique(),
                medicineData
            );
            return response;
        } catch (error) {
            console.error('Error creating medicine:', error);
            throw error;
        }
    },

    async searchMedicines(nameQuery) {
        if (!nameQuery) {
            return { documents: [] };
        }
        try {
            const response = await this.databases.listDocuments(databaseId, collectionMedicinesId, [Query.search('medicineName', nameQuery), Query.limit(10)]);
            return response.documents;
        } catch (error) {
            console.error(`Failed to search medicine by query "${nameQuery}":`, error);
            throw new Error(`Failed to search for medicine: ${error.message || error}`);
        }
    },

    async getMedicineById(medicineId) {
        try {
            const response = await databases.getDocument(databaseId, collectionMedicinesId, medicineId);
            return response;
        } catch (error) {
            console.error(`Failed to get medicine by ID ${medicineId}:`, error);
            throw new Error(`Failed to get medicine by ID: ${error.message || error}`);
        }
    },

    async updateMedicine(medicineId, medicineData) {
        try {
            const response = await databases.updateDocument(databaseId, collectionMedicinesId, medicineId, medicineData);
            return response;
        } catch (error) {
            console.error(`Failed to update medicine with ID ${medicineId}:`, error);
            throw new Error(`Failed to update medicine ${medicineId}: ${error.message || error}`);
        }
    },

    async deleteMedicine(medicineId) {
        try {
            const response = await databases.deleteDocument(databaseId, collectionMedicinesId, medicineId);
            return response;
        } catch (error) {
            console.error(`Failed to delete medicine with ID ${medicineId}:`, error);
            throw new Error(`Failed to delete medicine ${medicineId}: ${error.message || error}`);
        }
    },

    async getAllMedicines() {
        try {
            const response = await databases.listDocuments(databaseId, collectionMedicinesId, [Query.limit(100)]);
            return response.documents;
        } catch (error) {
            console.error('Failed to get all medicines:', error);
            throw new Error(`Failed to get all medicines: ${error.message || error}`);
        }
    }
}

export { medicineService }