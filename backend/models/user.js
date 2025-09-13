
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        age: { type: Number, required: true },

        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
