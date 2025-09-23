const express = require("express");
const UserController = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /users/register
 * @description Register a new user.
 * @access Public
 */
router.post("/register", UserController.registerUser);

/**
 * @route POST /users/login
 * @description Authenticate a user and return a JWT token.
 * @access Public
 */
router.post("/login", UserController.loginUser);

/**
 * @route GET /users/me
 * @description Get the currently authenticated user.
 * @access Private
 */
router.get("/me", auth, UserController.getCurrentUser);

/**
 * @route GET /users
 * @description Get all users.
 * @access Public
 */
router.get("/", (req, res) => UserController.getAll(req, res));

/**
 * @route GET /users/:id
 * @description Get a specific user by ID.
 * @access Public
 */
router.get("/:id", (req, res) => UserController.read(req, res));

/**
 * @route PUT /users/:id
 * @description Update user details by ID.
 * @access Public
 */
router.put("/:id", (req, res) => UserController.editUser(req, res));

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID.
 * @access Private
 */
router.delete("/:id", auth, (req, res) => UserController.deleteUser(req, res));

module.exports = router;
