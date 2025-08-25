import express from "express";
const route = express.Router();
import TaskController from '../controllers/task.js';

route.get("/", TaskController.getAllTask)
route.get("/:id", TaskController.getOneTask)
route.post("/", TaskController.createTask)
route.put("/:id",TaskController.updateTask)
route.delete("/:id",TaskController.deleteTask)

export default route;