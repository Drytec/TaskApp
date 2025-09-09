const GlobalController = require("./globalController.js");
const taskDAO = require("../DAO/taskDAO.js");

class TaskController extends GlobalController {
    constructor() {
        super(taskDAO)
    }

}
module.exports = new TaskController();



