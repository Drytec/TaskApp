const Task = require("../models/task.js");
const GlobalDAO = require("./globalDAO.js");

class TaskDAO extends GlobalDAO{
    constructor() {
        super(Task);
    }
}

module.exports = new TaskDAO();
