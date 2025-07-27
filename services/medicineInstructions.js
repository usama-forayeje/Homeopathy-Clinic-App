import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwirte/client';


const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionMedicineInstructionsId = process.env.NEXT_PUBLIC_COLLECTION_MEDICINEINSTRUCTIONS_ID;

const medicineInstructionsService = {
    async createInstruction(instructionData) {
        try {
            const response = await databases.createDocument(databaseId, collectionMedicineInstructionsId, ID.unique(), instructionData);
            return response;
        } catch (error) {
            console.error('Error creating instruction:', error);
            if (error && error.code === 409) {
                throw new Error('An instruction with this name already exists.');
            }
            throw new Error(`Failed to create instruction: ${error.message || error}`);
        }
    },

    async getAllInstructions() {
        try {
            const response = await databases.listDocuments(databaseId, collectionMedicineInstructionsId, [Query.limit(100)]);
            return response.documents;
        } catch (error) {
            console.error('Failed to get all instructions:', error);
            throw new Error(`Failed to get all instructions: ${error.message || error}`);
        }
    },

    async searchInstructions(textQuery) {
        if (!textQuery) {
            return { documents: [] };
        }
        try {
            const response = await databases.listDocuments(databaseId, collectionMedicineInstructionsId, [Query.search('instructionText', textQuery), Query.limit(10)]);
            return response.documents;
        } catch (error) {
            console.error(`Failed to search instruction by query "${nameQuery}":`, error);
            throw new Error(`Failed to search for instruction: ${error.message || error}`);
        }
    },

    async getInstructionById(instructionId) {
        try {
            const response = await databases.getDocument(databaseId, collectionMedicineInstructionsId, instructionId);
            return response;
        } catch (error) {
            console.error(`Failed to get instruction by ID ${instructionId}:`, error);
            throw new Error(`Failed to get instruction by ID: ${error.message || error}`);
        }
    },

    async updateInstruction(instructionId, instructionData) {
        try {
            const response = await databases.updateDocument(databaseId, collectionMedicineInstructionsId, instructionId, instructionData);
            return response;
        } catch (error) {
            console.error(`Failed to update instruction with ID ${instructionId}:`, error);
            throw new Error(`Failed to update instruction ${instructionId}: ${error.message || error}`);
        }
    },

    async deleteInstruction(instructionId) {
        try {
            const response = await databases.deleteDocument(databaseId, collectionMedicineInstructionsId, instructionId);
            return response;
        } catch (error) {
            console.error(`Failed to delete instruction with ID ${instructionId}:`, error);
            throw new Error(`Failed to delete instruction ${instructionId}: ${error.message || error}`);
        }
    },

};

export { medicineInstructionsService };