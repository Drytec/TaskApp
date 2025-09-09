const express = require("express");
// Import the controller functions for password reset
const { requestPasswordReset, resetPassword } = require("../controllers/auth");

const router = express.Router();

// Route to handle password reset request (send reset email)
router.post("/forgot-password", requestPasswordReset);

// Route to handle the actual password reset with token and new password
router.post("/reset-password", resetPassword);

module.exports = router;

