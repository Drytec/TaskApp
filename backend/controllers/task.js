const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

/**
 * Controller for tasks, extending GlobalController.
 * @class
 * @extends GlobalController
 */
class TaskController extends GlobalController {
    /**
     * @constructor
     */
    constructor() {
        super(taskDAO);
    }

    /**
     * Create a new task for the authenticated user.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    createTask = async (req, res) => {
        try {
            const userId = req.user.id;
            const taskData = { ...req.body, user: userId };

            // Keep date as string to avoid timezone issues ("YYYY-MM-DD")
            const task = await taskDAO.create(taskData);
            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Get all tasks for the authenticated user.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    getAllTasks = async (req, res) => {
        try {
            const userId = req.user.id;
            const tasks = await taskDAO.getAll({ user: userId });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Edit a task by ID.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    editTask = async (req, res) => {
        try {
            const taskId = req.params.id;
            const updates = req.body;
            const updatedTask = await taskDAO.update(taskId, updates);
            res.json(updatedTask);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Delete a task by ID.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    deleteTask = async (req, res) => {
        try {
            const taskId = req.params.id;
            const task = await taskDAO.getById(taskId);

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            if (task.userId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            await taskDAO.delete(taskId);
            res.json({ message: "Task deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new TaskController();



