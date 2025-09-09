const Task = require("../models/task.js");  // Import the Task Mongoose model
const GlobalDAO = require("./globalDAO.js"); // Import the generic GlobalDAO class

// TaskDAO extends the GlobalDAO to handle Task-specific database operations
class TaskDAO extends GlobalDAO {
    constructor() {
        super(Task);  // Call parent constructor with Task model
    }
}

module.exports = new TaskDAO(); // Export an instance of TaskDAO

