const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

router.get("/", (req, res) => UserController.getAll(req, res));
router.get("/:id", (req, res) => UserController.read(req, res));
router.put("/:id", (req, res) => UserController.edit(req, res));
router.delete("/:id", (req, res) => UserController.delete(req, res));

module.exports = router;

