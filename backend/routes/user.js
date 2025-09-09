import express from "express";
import UserController from "../controllers/user.js";

const router = express.Router();

// Route for user registration
router.post("/register", UserController.registerUser);

// Route for user login
router.post("/login", UserController.loginUser);

// Route to get all users
router.get("/", (req, res) => UserController.getAll(req, res));

// Route to get a specific user by ID
router.get("/:id", (req, res) => UserController.read(req, res));

// Route to update a user by ID
router.put("/:id", (req, res) => UserController.update(req, res));

// Route to delete a user by ID
router.delete("/:id", (req, res) => UserController.delete(req, res));

export default router;


