const API_URL = 'http://localhost:3000/api'; 

// Retrieve the auth token from localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// Create a new task with the given task data
async function createTask(taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('You are not authenticated');
        }

        // Prepare task payload with fallback keys
        const taskPayload = {
            taskName: taskData.taskName || taskData.name,
            taskDescription: taskData.taskDescription || taskData.description,
            isImportant: taskData.isImportant || false,
            isComplete: false,
        };

        // Send POST request to create task
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error creating the task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get all tasks for the authenticated user
async function getAllTasks() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('You are not authenticated');
        }

        // Fetch all tasks with authorization header
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error fetching tasks');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get a single task by its ID
async function getTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('You are not authenticated');
        }

        // Fetch specific task by ID with authorization
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error fetching the task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update a task with provided update data
async function updateTask(taskId, updateData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('You are not authenticated');
        }

        // Prepare payload only with properties to update
        const taskPayload = {};
        
        if (updateData.hasOwnProperty('taskName')) {
            taskPayload.taskName = updateData.taskName;
        }
        if (updateData.hasOwnProperty('taskDescription')) {
            taskPayload.taskDescription = updateData.taskDescription;
        }
        if (updateData.hasOwnProperty('isComplete')) {
            taskPayload.isComplete = updateData.isComplete;

            // Set completion date if marked complete
            if (updateData.isComplete) {
                taskPayload.dateCompleted = new Date();
            }
        }
        if (updateData.hasOwnProperty('isImportant')) {
            taskPayload.isImportant = updateData.isImportant;
        }

        // Send PUT request to update the task
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error updating the task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Delete a task by its ID
async function deleteTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('You are not authenticated');
        }

        // Send DELETE request to remove task
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error deleting the task');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
