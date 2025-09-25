const express = require("express");
const userRoutes = require("./user.js");
const taskRoutes = require("./task.js");
const authRoutes = require("./auth.js");

const router = express.Router();

/**
 * Root API router.
 * 
 * @module routes/index
 * @description Aggregates user, task, and authentication routes.
 */
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);

module.exports = router;
