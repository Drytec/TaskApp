
const express = require("express");
const { requestPasswordReset, resetPassword } = require("../controllers/auth");
const router = express.Router();

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
