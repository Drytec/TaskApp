const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

class TaskController extends GlobalController {
    constructor() {
        super(taskDAO)
    }
createTask = async (req, res) => {
    console.log("📝 Intentando crear tarea");
    console.log("👤 Usuario:", req.user);
    console.log("📦 Datos recibidos:", req.body);
    
    try {
        const userId = req.user.id || req.user._id; // Algunos tokens usan _id
        const taskData = { 
            ...req.body, 
            user: userId,
            taskDescription: req.body.taskDescription || "" // Asegurar que no sea undefined
        };
        
        console.log("💾 Datos finales para guardar:", taskData);

        const task = await taskDAO.create(taskData);
        console.log("✅ Tarea creada:", task);
        
        res.status(201).json(task);
    } catch (err) {
        console.error("❌ Error detallado:", err);
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



