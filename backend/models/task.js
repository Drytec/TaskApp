import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class TaskModel {
    constructor() {}

    async createTask(task) {
        const collTask = dbClient.db.collection("tasks");
        return await collTask.insertOne(task);
    }

    async getAllTasks() {
        const collTask = dbClient.db.collection("tasks");
        return await collTask.find({}).toArray();
    }

    async getOneTask(id) {
        const collTask = dbClient.db.collection("tasks");
        return await collTask.findOne({ _id: new ObjectId(id) });
    }

    async updateTask(id, task) {
        const collTask = dbClient.db.collection("tasks");
        return await collTask.updateOne(
            { _id: new ObjectId(id) },
            { $set: task }
        );
    }

    async deleteTask(id) {
        const collTask = dbClient.db.collection("tasks");
        return await collTask.deleteOne({ _id: new ObjectId(id) });
    }
}

export default new TaskModel();
