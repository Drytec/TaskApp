const express = require("express");
const TaskController = require("../controllers/task");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth,(req, res) => TaskController.getAllTasks(req, res));
router.get("/:id",auth, (req, res) => TaskController.read(req, res));
router.post("/",auth, (req, res) => TaskController.createTask(req, res));
router.put("/:id", auth,(req, res) => TaskController.update(req, res));
router.delete("/:id", auth,(req, res) => TaskController.delete(req, res));

module.exports = router;
