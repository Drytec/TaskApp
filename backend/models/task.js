const mongoose = require("mongoose");

/**
 * Task Schema for managing user tasks in the application.
 *
 * @typedef {Object} Task
 * @property {string} taskName - Name of the task (required).
 * @property {string} [taskDescription] - Optional description of the task.
 * @property {boolean} [isComplete=false] - Whether the task is completed.
 * @property {boolean} [isImportant=false] - Whether the task is marked as important.
 * @property {Date} [dateCreated=Date.now] - Date when the task was created.
 * @property {Date} [dateCompleted=Date.now] - Date when the task was completed.
 * @property {string|null} [dueDate=null] - Due date for the task in "YYYY-MM-DD" format.
 * @property {string} [dueTime] - Due time for the task (HH:mm).
 * @property {"Por hacer"|"Haciendo"|"Hecho"} [status="Por hacer"] - Current status of the task.
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the user who owns the task.
 */
const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, default: "" },
  isComplete: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
  dateCompleted: { type: Date, default: Date.now },
  dueDate: { type: String, default: null },
  dueTime: { type: String },
  status: {
    type: String,
    enum: ["Por hacer", "Haciendo", "Hecho"],
    default: "Por hacer",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports =
  mongoose.models.Task || mongoose.model("Task", TaskSchema);
