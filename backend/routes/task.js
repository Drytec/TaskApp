import express from "express";
import TaskController from "../controllers/task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Route to get all tasks, protected by authentication middleware
router.get("/", auth, (req, res) => TaskController.getAllTasks(req, res));

// Route to get a specific task by ID, protected by authentication middleware
router.get("/:id", auth, (req, res) => TaskController.read(req, res));

// Route to create a new task, protected by authentication middleware
router.post("/", auth, (req, res) => TaskController.createTask(req, res));

// Route to update an existing task by ID, protected by authentication middleware
router.put("/:id", auth, (req, res) => TaskController.update(req, res));

// Route to delete a task by ID, protected by authentication middleware
router.delete("/:id", auth, (req, res) => TaskController.delete(req, res));

export default router;

