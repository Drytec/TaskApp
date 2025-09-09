const express = require("express");
// Import user-related routes
const userRoutes = require("./user.js");
// Import task-related routes
const taskRoutes = require("./task.js");
// Import authentication-related routes
const authRoutes = require("./auth.js");

const router = express.Router();

// Mount user routes under /users path
router.use("/users", userRoutes);
// Mount task routes under /tasks path
router.use("/tasks", taskRoutes);
// Mount authentication routes under /auth path
router.use("/auth", authRoutes);

module.exports = router;

