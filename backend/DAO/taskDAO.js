/**
 * @file taskDAO.js
 * @description DAO class for Task model, extending GlobalDAO.
 */

const Task = require("../models/task.js");
const GlobalDAO = require("./globalDAO.js");

/**
 * DAO class to handle CRUD operations for the Task model.
 * Inherits all methods from GlobalDAO.
 */
class TaskDAO extends GlobalDAO {
    constructor() {
        super(Task);
    }
}

module.exports = new TaskDAO();
