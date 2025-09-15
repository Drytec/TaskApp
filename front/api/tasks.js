
const API_URL = 'http://localhost:3000/api'; 


function getToken() {
    return localStorage.getItem('authToken');
}


async function createTask(taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No estás autenticado');
        }

        
        const taskPayload = {
            taskName: taskData.taskName || taskData.name,
            taskDescription: taskData.taskDescription || taskData.description,
            isImportant: taskData.isImportant || false,
            isComplete: false,
        };

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
            throw new Error(data.error || 'Error al crear la tarea');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function getAllTasks() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No estás autenticado');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener las tareas');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function getTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No estás autenticado');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener la tarea');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateTask(taskId, updateData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No estás autenticado');
        }

       
        const taskPayload = {};
        
        if (updateData.hasOwnProperty('taskName')) {
            taskPayload.taskName = updateData.taskName;
        }
        if (updateData.hasOwnProperty('taskDescription')) {
            taskPayload.taskDescription = updateData.taskDescription;
        }
        if (updateData.hasOwnProperty('isComplete')) {
            taskPayload.isComplete = updateData.isComplete;
            
            if (updateData.isComplete) {
                taskPayload.dateCompleted = new Date();
            }
        }
        if (updateData.hasOwnProperty('isImportant')) {
            taskPayload.isImportant = updateData.isImportant;
        }

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
            throw new Error(data.error || 'Error al actualizar la tarea');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function deleteTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No estás autenticado');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al eliminar la tarea');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}