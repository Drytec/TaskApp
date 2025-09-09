const express = require("express");
const userRoutes = require("./user.js");
const taskRoutes = require("./task.js");
const authRoutes = require("./auth.js");
const API_URL = NEXT_PUBLIC_API_URL.env;
const router = express.Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);

module.exports = router;
