import { account } from "./config";

// Method to get the current logged-in user
export const getCurrentUser = async () => {
  try {
      const response = await account.get();
      return response; // Return user data
  } catch (error) {
      console.error('Error fetching current user:', error);
      throw error; // Throw error to handle it in the component
  }
};

// Method to update the current logged-in user
export const updateCurrentUser = async (name) => {
  try {
      const response =  await account.updateName(name);
      return response; 
  } catch (error) {
      console.error('Error fetching current user:', error);
      throw error; 
  }
};