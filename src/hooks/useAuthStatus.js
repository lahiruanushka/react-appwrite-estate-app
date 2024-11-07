// src/hooks/useAuthStatus.js

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../appwrite/auth';

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await getCurrentUser();
                setLoggedIn(!!user); // Set loggedIn based on user existence
            } catch (error) {
                setLoggedIn(false); // If there's an error, assume not logged in
            } finally {
                setCheckingStatus(false); // Set checking status to false after check
            }
        };

        checkUser(); // Call the function to check user status
    }, []);

    return { loggedIn, checkingStatus }; // Return the login status and checking status
};