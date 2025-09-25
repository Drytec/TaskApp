const express = require("express");
const TaskController = require("../controllers/task");
const auth = require("../middleware/auth");
const router = express.Router();

/**
 * @route GET /tasks
 * @description Get all tasks of the authenticated user.
 * @access Private
 */
router.get("/", auth, (req, res) => TaskController.getAllTasks(req, res));

/**
 * @route GET /tasks/:id
 * @description Get a specific task by ID.
 * @access Private
 */
router.get("/:id", auth, (req, res) => TaskController.read(req, res));

/**
 * @route POST /tasks
 * @description Create a new task for the authenticated user.
 * @access Private
 */
router.post("/", auth, (req, res) => TaskController.createTask(req, res));

/**
 * @route PUT /tasks/:id
 * @description Update a task by ID.
 * @access Private
 */
router.put("/:id", auth, (req, res) => TaskController.update(req, res));

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID.
 * @access Private
 */
router.delete("/:id", auth, (req, res) => TaskController.delete(req, res));

module.exports = router;
