
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
            taskName: {type: String, required: true},
            taskDescription: {type: String, required: true},
            isComplete: {type: Boolean, default: false},
            isImportant: {type: Boolean, default: false},
            dateCreated: {type: Date, default: Date.now},
            dateCompleted: {type: Date, default: Date.now},
            dueDate: {type: Date},
            dueTime: {type: String},
            status: {type: String, enum: ['Por hacer', 'Haciendo', 'Hecho'], default: 'Por hacer'},
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    }
)

module.exports = mongoose.model.Task||mongoose.model("Task", TaskSchema);

