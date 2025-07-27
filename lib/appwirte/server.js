import { Client, Account, Databases } from 'appwrite';

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const apiSecret = process.env.APPWRITE_API_SECRET_KEY;

const serverClient = new Client();
serverClient.setEndpoint(endpoint).setProject(projectId).setKey(apiSecret);

const serverAccount = new Account(serverClient);
const serverDatabases = new Databases(serverClient);

export { serverClient, serverAccount, serverDatabases };