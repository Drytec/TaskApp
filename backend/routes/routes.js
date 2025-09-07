const express = require("express");
const userRoutes = require("./user.js");
const taskRoutes = require("./task.js");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
