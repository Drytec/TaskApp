const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

class TaskController extends GlobalController {
    constructor() {
        super(taskDAO)
    }
    createTask = async (req, res) => {
        try {
            const userId = req.user.id;
            const taskData = {
                ...req.body,
                user: userId,
                dueDate: req.body.dueDate, 
                dueTime: req.body.dueTime
            };

            // Mantener la fecha como string para evitar problemas de zona horaria
            // No convertir a Date, mantener como string "YYYY-MM-DD"


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
            const userId = req.user.id;
            const taskId = req.params.id;
            const updates = req.body;

            // Mantener la fecha como string para evitar problemas de zona horaria
            // No convertir a Date, mantener como string "YYYY-MM-DD"

            const updatedTask = await taskDAO.update(taskId, updates);
            res.json(updatedTask);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
module.exports = new TaskController();