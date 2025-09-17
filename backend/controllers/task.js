const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

class TaskController extends GlobalController {
    constructor() {
        super(taskDAO)
    }
    createTask = async (req, res) => {
        try {
            const userId = req.user.id;
            const taskData = { ...req.body, user: userId };

            // 👇 Forzar que dueDate quede como string simple
            if (taskData.dueDate) {
                taskData.dueDate = taskData.dueDate.split("T")[0];
            }

            const task = await taskDAO.create(taskData);
            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    getAllTasks = async (req, res) => {
        try {
            const userId = req.user.id;
            const tasks = await taskDAO.getAll({ user: userId });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    editTask = async (req, res) => {
        try {
            const updates = req.body;

            if (updates.dueDate) {
                updates.dueDate = updates.dueDate.split("T")[0];
            }

            const updatedTask = await taskDAO.update(req.params.id, updates);
            res.json(updatedTask);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

}
module.exports = new TaskController();