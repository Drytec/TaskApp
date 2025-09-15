const API_URL = "/api"; 


function saveToken(token) {
    localStorage.setItem('authToken', token);
}


function getToken() {
    return localStorage.getItem('authToken');
}


function removeToken() {
    localStorage.removeItem('authToken');
}


function isAuthenticated() {
    return !!getToken();
}

async function checkAuth() {
    const token = getToken();
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}


async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }

        saveToken(data.token);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function signup(userData) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar usuario');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


function logout() {
    removeToken();
    window.location.href = '/login';
}