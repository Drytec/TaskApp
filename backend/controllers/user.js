const GlobalController = require("./globalController.js");
const UserDAO = require("../DAO/userDAO.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// UserController extends the generic GlobalController
// It adds user-specific methods like registration and login
class UserController extends GlobalController {
    constructor() {
        // Pass UserDAO instance to the parent constructor
        super(UserDAO);
    }

    // Register a new user with validation and password hashing
    registerUser = async (req, res) => {
        try {
            const { email, password, name, lastname, age } = req.body;

            // Validate password strength: minimum 8 chars, upper & lower case, number
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    error:
                        "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
                });
            }

            // Hash password with bcrypt before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new User instance with hashed password and other details
            const user = new User({ email, password: hashedPassword, name, lastname, age });

            // Save the new user to the database
            await user.save();

            // Send success response
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            // Handle unexpected errors
            res.status(500).json({ error: err.message });
        }
    };

    // User login: verify credentials and return JWT token
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: "User not found" });

            // Compare given password with hashed password stored
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ error: "Incorrect password" });

            // Sign JWT token with user ID and email as payload
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES || "1h" }
            );

            // Return the token to client
            res.json({ token });
        } catch (err) {
            // Handle unexpected errors
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new UserController();
