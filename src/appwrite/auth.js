import { account, ID } from './config';

// Method to sign up a new user
export const handleSignup = async (username, email, password) => {
    try {
        const response = await account.create(ID.unique(), email, password, username);
        console.log('Successfully signed up:', response);
        return response; // Return the response for further handling
    } catch (error) {
        console.error('Signup error:', error);
        throw error; // Throw error to handle it in the component
    }
};

// Method to log in an existing user
export const handleLogin = async (email, password) => {
    try {
        const response = await account.createEmailPasswordSession(email, password);
        console.log('Successfully logged in:', response);
        return response; // Return the response for further handling
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Throw error to handle it in the component
    }
};

// Method to log out the current user
export const handleLogout = async () => {
    try {
        await account.deleteSession('current');
        console.log('Successfully logged out');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Method to get the current logged-in user
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        console.log('Current user:', user);
        return user; // Return user data
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error; // Throw error to handle it in the component
    }
};