import { Databases, ID, Query } from "appwrite";
import conf from "../conf/conf";
import client from "../conf/appwriteClient";

class LitingsService {
  constructor() {
    this.databases = new Databases(client);
  }

  async createLitings(data) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        ID.unique(), // Use a unique ID for the document
        data
      );
    } catch (error) {
      console.error("LitingsService :: createLitings() :: ", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }

  async getListing(documentId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        documentId
      );
    } catch (error) {
      console.error("LitingsService :: getLiting() :: ", error);
      throw error;
    }
  }

  async updateListing(documentId, data) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        documentId,
        data
      );
    } catch (error) {
      console.error("LitingsService :: updateLitings() :: ", error);
      throw error;
    }
  }

  async deleteLiting(documentId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        documentId
      );
    } catch (error) {
      console.error("LitingsService :: deleteLitings() :: ", error);
      throw error;
    }
  }

  async getLitings(queries = []) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        queries
      );
    } catch (error) {
      console.error("LitingsService :: getLitings() :: ", error);
      throw error;
    }
  }

  async getUserLitings(userId) {
    if (!userId) {
      throw new Error("User ID must be provided");
    }

    const queries = [Query.equal("userId", userId)];

    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteListingsCollectionId,
        queries
      );
      return response.documents; // Return the array of documents
    } catch (error) {
      console.error("LitingsService :: getUserLitings() :: ", error);
      throw error;
    }
  }
}

const listingService = new LitingsService();
export default listingService;
