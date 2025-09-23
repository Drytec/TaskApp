const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");

/**
 * Request password reset for a user.
 * Generates a reset token and sends an email with the reset link.
 *
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(202).json({ message: "If the email exists, a reset link will be sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        const resetUrl = `https://task-app-front-mu.vercel.app/reset-password?token=${resetToken}`;
        const html = `
            <p>Hello ${user.name},</p>
            <p>You requested a password reset. Click the following link (expires in 1 hour):</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, ignore this email.</p>
        `;

        await sendEmail(user.email, "Password Reset", html);

        return res.status(200).json({ message: "Recovery email sent" });
    } catch (err) {
        console.error("requestPasswordReset error:", err);
        return res.status(500).json({ error: "Try again later" });
    }
};

/**
 * Reset user's password using token.
 *
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (!token) return res.status(400).json({ error: "Token is required" });
        if (!newPassword || !confirmPassword) return res.status(400).json({ error: "Fill in the passwords" });
        if (newPassword !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters and include uppercase, lowercase, and number"
            });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ error: "Invalid or expired link" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        return res.status(200).json({ message: "Password updated" });
    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ error: "Try again later" });
    }
};
