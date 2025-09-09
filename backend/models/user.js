const mongoose = require("mongoose");

// Define the schema for User documents
const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },           // User's email address, required
        password: { type: String, required: true },        // User's hashed password, required
        name: { type: String, required: true },            // User's first name, required
        lastname: { type: String, required: true },        // User's last name, required
        age: { type: Number, required: true },             // User's age, required

        resetPasswordToken: { type: String },               // Token for password reset functionality
        resetPasswordExpires: { type: Date }                // Expiration date/time for the reset token
    },
    { timestamps: true }                                    // Automatically add createdAt and updatedAt timestamps
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

