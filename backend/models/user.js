const mongoose = require("mongoose");

/**
 * User Schema for managing application users.
 *
 * @typedef {Object} User
 * @property {string} email - User email (unique and required).
 * @property {string} password - Hashed user password.
 * @property {string} name - First name of the user.
 * @property {string} lastname - Last name of the user.
 * @property {number} age - Age of the user.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date for the reset token.
 * @property {Date} [createdAt] - Date when the user was created (auto-generated).
 * @property {Date} [updatedAt] - Date when the user was last updated (auto-generated).
 */
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: Number, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema);
