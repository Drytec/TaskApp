
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        taskName: {type: String, required: true},
        taskDescription: {type: String, required: false}, 
        isComplete: {type: Boolean, default: false},
        isImportant: {type: Boolean, default: false},
        dateCreated: {type: Date, default: Date.now},
        dateCompleted: {type: Date, default: null}, 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    }
)


module.exports = mongoose.models.Task || mongoose.model("Task", TaskSchema);