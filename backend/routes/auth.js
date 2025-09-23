const express = require("express");
const { requestPasswordReset, resetPassword } = require("../controllers/auth");
const router = express.Router();

/**
 * @route POST /auth/forgot-password
 * @description Request a password reset by email. Generates a reset token.
 * @access Public
 */
router.post("/forgot-password", requestPasswordReset);

/**
 * @route POST /auth/reset-password
 * @description Reset the user's password using a valid reset token.
 * @access Public
 */
router.post("/reset-password", resetPassword);

module.exports = router;
