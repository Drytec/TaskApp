const API_URL = NEX_PUBLIC_API_URL.env; 

async function createTask(taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                taskName: taskData.taskName,
                taskDescription: taskData.taskDescription || '',
                isImportant: taskData.isImportant || false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error creating task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to get all tasks
async function getAllTasks() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error getting tasks');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to update a task
async function updateTask(taskId, updateData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error updating task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error deleting task');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to get a specific task
async function getTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error getting task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

console.log('Tasks.js loaded successfully');

// Exponer createTask globalmente para el HTML
window.createTask = createTask;