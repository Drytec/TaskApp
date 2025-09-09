// backend/controllers/authController.js

// Import required modules
const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");

/**
 * Handles the request to reset a user's password.
 * It generates a secure token, stores a hashed version in the database,
 * and sends a password reset link to the user's email.
 */
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Look for a user with the given email
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal whether the email exists — for security
            return res.status(202).json({ message: "If the email exists, a recovery link will be sent." });
        }

        // Generate a random reset token (raw)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the token to store in the database
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set the hashed token and expiration time on the user
        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour

        // Save user with reset token and expiration
        await user.save();

        // Create password reset URL using the raw (unhashed) token
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset?token=${resetToken}`;

        // Compose HTML email content
        const html = `
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Click the link below (valid for 1 hour):</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        // Send password reset email
        await sendEmail(user.email, "Password Recovery", html);

        return res.status(200).json({ message: "Recovery email sent" });
    } catch (err) {
        console.error("requestPasswordReset error:", err);
        return res.status(500).json({ error: "Please try again later" });
    }
};

/**
 * Handles the actual password reset after the user clicks the link.
 * It validates the token, checks the new passwords, and updates the user's password.
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        // Validate required fields
        if (!token) return res.status(400).json({ error: "Token is required" });
        if (!newPassword || !confirmPassword) return res.status(400).json({ error: "Passwords are required" });
        if (newPassword !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

        // Check if password meets complexity requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        // Hash the token to match the stored version
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        // Find user with matching reset token and unexpired token
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired link" });

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token and expiration fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Optional: Set a timestamp to track password change
        user.passwordChangedAt = Date.now();

        // Save updated user
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ error: "Please try again later" });
    }
};
