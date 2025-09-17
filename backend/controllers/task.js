const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

class TaskController extends GlobalController {
    constructor() {
        super(taskDAO);
    }

    createTask = async (req, res) => {
        try {
            const userId = req.user.id;
            const taskData = {
                ...req.body,
                user: userId,
            };

            // 👇 Forzar formato YYYY-MM-DD si viene con hora
            if (taskData.dueDate) {
                taskData.dueDate = taskData.dueDate.split("T")[0];
            }

            const task = await taskDAO.create(taskData);

            // También limpiar antes de enviar respuesta
            if (task.dueDate) {
                task.dueDate = task.dueDate.split("T")[0];
            }

            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAllTasks = async (req, res) => {
        try {
            const userId = req.user.id;
            const tasks = await taskDAO.getAll({ user: userId });

            // 👇 Formatear todas las fechas
            const formattedTasks = tasks.map(t => {
                if (t.dueDate) {
                    t.dueDate = t.dueDate.split("T")[0];
                }
                return t;
            });

            res.json(formattedTasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    editTask = async (req, res) => {
        try {
            const taskId = req.params.id;
            const updates = { ...req.body };

            // 👇 Forzar formato YYYY-MM-DD en updates
            if (updates.dueDate) {
                updates.dueDate = updates.dueDate.split("T")[0];
            }

            const updatedTask = await taskDAO.update(taskId, updates);

            // También limpiar en respuesta
            if (updatedTask.dueDate) {
                updatedTask.dueDate = updatedTask.dueDate.split("T")[0];
            }

            res.json(updatedTask);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new TaskController();
