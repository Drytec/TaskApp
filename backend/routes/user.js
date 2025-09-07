import express from "express";
import UserController from "../controllers/user.js";

const route = express.Router();

route.post("/register", UserController.registerUser);
route.post("/login", UserController.loginUser);

export default route;
