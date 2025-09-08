const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
import express from "express";
import taskRoutes from './backend/routes/task.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname); // Para debugging

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware para debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Rutas de backend
app.use('/task', taskRoutes);

// Servir archivos estáticos de la carpeta "Front"
app.use(express.static(path.join(__dirname, "Front")));

// Ruta raíz - redirige a login
app.get("/", (req, res) => {
    console.log("Redirecting to /login");
    res.redirect("/login");
});

// Ruta para login
app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "login.html");
    console.log("Serving login from:", filePath);
    res.sendFile(filePath);
});

// Ruta para signup
app.get("/signup", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "signup.html");
    console.log("Serving signup from:", filePath);
    res.sendFile(filePath);
});

// 404 handler
app.use((req, res) => {
    console.log("404 - Not found:", req.path);
    res.status(404).send(`Cannot find ${req.path}`);
});

try {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on http://localhost:" + port);
    });
} catch (err) {
    console.error(err);
}