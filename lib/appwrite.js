import { Client, Account, Databases, Query } from "appwrite"

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
export const COLLECTIONS = {
  PATIENTS: process.env.NEXT_PUBLIC_COLLECTION_PATIENTS_ID,
  CONSULTATIONS: process.env.NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID,
  PATIENT_HABITS: process.env.NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID,
  DISEASES: process.env.NEXT_PUBLIC_COLLECTION_DISEASES_ID,
  PRESCRIBED_MEDICINES: process.env.NEXT_PUBLIC_COLLECTION_PRESCRIBED_MEDICINES_ID,
  CHAMBERS: process.env.NEXT_PUBLIC_COLLECTION_CHAMBERS_ID,
}

export { Query }
export default client
