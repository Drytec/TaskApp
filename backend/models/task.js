const mongoose = require("mongoose");

// Define the schema for Task documents
const TaskSchema = new mongoose.Schema(
    {
        taskName: { type: String, required: true },          // Name/title of the task, required
        taskDescription: { type: String, required: true },   // Description/details of the task, required
        isComplete: { type: Boolean, default: false },       // Flag indicating if the task is completed, default false
        isImportant: { type: Boolean, default: false },      // Flag indicating if the task is important, default false
        dateCreated: { type: Date, default: Date.now },      // Date when the task was created, default to current date
        dateCompleted: { type: Date, default: Date.now },    // Date when task was completed, default to current date (consider updating when marked complete)
        user: {                                              // Reference to the User who owns the task
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        }
    }
);

// Export the Task model, use existing if already created
module.exports = mongoose.model.Task || mongoose.model("Task", TaskSchema);
