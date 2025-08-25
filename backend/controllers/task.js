import TaskModel from "../models/task.js";

class TaskController {
    constructor(task) {

    }
    async createTask(req, res) {
        try {
            const data = await TaskModel.createTask(req.body);
            res.status(201).json({data});
        }catch(err) { res.status(500).json({status: "error"}); }
    }
    async updateTask(req, res) {
        try {
            const {id} = req.params;
            const data = await TaskModel.updateTask(id,req.body);
            res.status(200).json({data});
        }catch(err) { res.status(500).json({status: "error"}); }
    }
    async deleteTask(req, res) {
        try {
            const {id} = req.params;
            const data = await TaskModel.deleteTask(id);
            res.status(204).json({status: "ok"});
        }catch(err) { res.status(500).json({status: "error"}); }
    }
    async getAllTask(req, res) {
        try {
            const data = await TaskModel.getAllTasks();
            res.status(200).json(data);
        }catch(err) { res.status(500).json({status: "error"}); }
    }
    async getOneTask(req, res) {
        try {
            const {id} = req.params;
            const data = await TaskModel.getOneTask(id);
            res.status(200).json(data);
        }catch(err) { res.status(500).json({status: "error"}); }
    }

}
export default new TaskController();