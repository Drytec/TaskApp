const GlobalController = require("./globalController.js");
const UserDAO = require("../DAO/userDAO.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

/**
 * Controller for user operations, extending GlobalController.
 * @class
 * @extends GlobalController
 */
class UserController extends GlobalController {
    /**
     * @constructor
     */
    constructor() {
        super(UserDAO);
    }
    /**
     * Get the currently authenticated user.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    getCurrentUser = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: "User not found" });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Register a new user.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    registerUser = async (req, res) => {
        try {
            const { email, password, name, lastname, age } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: "Email already registered" });

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ 
                    error: "Password must be at least 8 characters and include uppercase, lowercase, and number" 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, name, lastname, age });
            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            if (err.code === 11000) return res.status(400).json({ error: "Email already registered" });
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Login a user.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: "User not found" });

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return res.status(400).json({ error: "Invalid password" });

            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES || "1h"
            });

            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Edit user information.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    editUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const { name, lastname, age, email, password } = req.body;

            if (email !== undefined) {
                return res.status(400).json({ error: "Email field is not editable" });
            }

            const updates = {};
            if (name) updates.name = name;
            if (lastname) updates.lastname = lastname;
            if (age) updates.age = age;
            if (password) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        error: "Password must be at least 8 characters and include uppercase, lowercase, and number"
                    });
                }
                updates.password = await bcrypt.hash(password, 10);
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "No valid fields to update" });
            }

            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            if (!user) return res.status(404).json({ error: "User not found" });

            res.json({ message: "User info updated", user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    /**
     * Delete a user account.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    deleteUser = async (req, res) => {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).json({ error: "Not authorized to delete this account" });
            }

            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ error: "User not found" });

            res.json({ message: "User account deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new UserController();

