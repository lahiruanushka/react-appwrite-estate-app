import { Account, Databases, Query } from "appwrite";
import client from "../conf/appwriteClient";
import conf from "../conf/conf";

class UserService {
  constructor() {
    this.account = new Account(client);
    this.databases = new Databases(client);
  }

  async getUserProfile(userId) {
    if (!userId) {
      throw new Error("User ID must be provided");
    }

    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfilesCollectionId,
        userId
      );
    } catch (error) {
      console.error("UserService :: getUserProfile() :: ", error);
      throw error;
    }
  }

  async createUserProfile(userId, username, fullName) {
    if (!userId || !username || !fullName) {
      throw new Error("User ID, Full Name and username must be provided");
    }

    const userProfileData = {
      userId: userId,
      username: username,
      fullName: fullName,
    };

    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfilesCollectionId,
        userId, // Use userId as the document ID
        userProfileData
      );
    } catch (error) {
      console.error("UserService :: createUserProfile() :: ", error);
      throw error;
    }
  }

  async checkUsernameUniqueness(username, currentUsername) {
    const query = [
      Query.equal("username", username),
      Query.notEqual("username", currentUsername)
    ];

    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProfilesCollectionId,
        query
      );

      return response.documents.length === 0; // Returns true if no documents found
    } catch (error) {
      console.error("UserService :: checkUsernameUniqueness() :: ", error);
      throw error;
    }
  }

  async updateUserProfile(userId, username, fullName) {
    if (!userId || !username || !fullName) {
      throw new Error("User ID, Full Name and username must be provided");
    }

    // Fetch the current user profile to get the existing username
    const currentProfile = await this.getUserProfile(userId);
    
    // Check if the new username is unique without considering the current username
    const isUnique = await this.checkUsernameUniqueness(username, currentProfile.username);

    if (!isUnique) {
      throw new Error("Username already exists. Please choose a different one.");
    }

    const updatedData = {
      username: username,
      fullName: fullName,
    };

    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfilesCollectionId,
        userId, // Use userId as the document ID
        updatedData
      );
    } catch (error) {
      console.error("UserService :: updateUserProfile() :: ", error);
      throw error;
    }
  }

  async softDeleteUserProfile(userId) {
    if (!userId) {
      throw new Error("User ID must be provided");
    }

    const updatedData = {
      isDeleted: true, // Mark the user as deleted
    };

    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfilesCollectionId,
        userId, // Use userId as the document ID
        updatedData
      );
    } catch (error) {
      console.error("UserService :: softDeleteUserProfile() :: ", error);
      throw error;
    }
  }

}

const userService = new UserService();
export default userService;