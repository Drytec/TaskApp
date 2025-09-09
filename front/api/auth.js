const API_URL = 'http://localhost:3000/api'; // Base URL for the backend API


// Save the authentication token in localStorage
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

// Retrieve the authentication token from localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// Remove the authentication token from localStorage (logout)
function removeToken() {
    localStorage.removeItem('authToken');
}

// Check if the user is authenticated by verifying if a token exists
function isAuthenticated() {
    return !!getToken();
}

// Function to log in a user with email and password
async function login(email, password) {
    try {
        // Send POST request to login endpoint
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // If response is not OK, throw error with message from server or generic message
        if (!response.ok) {
            throw new Error(data.error || 'Error logging in');
        }

        // Save received token and return success with data
        saveToken(data.token);
        return { success: true, data };
    } catch (error) {
        // Return failure with error message
        return { success: false, error: error.message };
    }
}

// Function to register a new user with provided user data
async function signup(userData) {
    try {
        // Send POST request to register endpoint
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        // If response is not OK, throw error with message from server or generic message
        if (!response.ok) {
            throw new Error(data.error || 'Error registering user');
        }

        // Return success with data
        return { success: true, data };
    } catch (error) {
        // Return failure with error message
        return { success: false, error: error.message };
    }
}

// Logout function: remove token and redirect to login page
function logout() {
    removeToken();
    window.location.href = '/login';
}
