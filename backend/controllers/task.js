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


}
module.exports = new TaskController();



