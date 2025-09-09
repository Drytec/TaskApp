const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

// TaskController extends the generic GlobalController
// It inherits the basic CRUD methods and adds task-specific logic
class TaskController extends GlobalController {
    constructor() {
        // Pass taskDAO to the GlobalController constructor to handle DB operations
        super(taskDAO);
    }

    // Custom method to create a task associated with the authenticated user
    createTask = async (req, res) => {
        try {
            // Get user ID from authenticated user info (assumed set in req.user)
            const userId = req.user.id;

            // Merge task data from request body with user ID to associate task to user
            const taskData = { ...req.body, user: userId };

            // Use DAO to create the task in the database
            const task = await taskDAO.create(taskData);

            // Respond with the newly created task and HTTP status 201 (Created)
            res.status(201).json(task);
        } catch (err) {
            // Handle unexpected errors with HTTP 500 status
            res.status(500).json({ error: err.message });
        }
    };

    // Custom method to get all tasks belonging to the authenticated user
    getAllTasks = async (req, res) => {
        try {
            // Get user ID from authenticated user info
            const userId = req.user.id;

            // Use DAO to retrieve tasks filtered by user ID
            const tasks = await taskDAO.getAll({ user: userId });

            // Respond with array of tasks
            res.json(tasks);
        } catch (err) {
            // Handle errors with HTTP 500 status
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new TaskController();