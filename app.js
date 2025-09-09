import dotenv from "dotenv";
dotenv.config();
import express from "express";
import taskRoutes from './backend/routes/task.js';
import path from "path";
import { fileURLToPath } from "url";

const { connectDB } = require("./backend/config/dbClient.js");
const cors = require("cors");
const routes = require("./backend/routes/routes.js");
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

// Ruta para password-recovery
app.get("/password-recovery", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "password-recovery.html");
    console.log("Serving password-recovery from:", filePath);
    res.sendFile(filePath);
});

// Ruta para welcome-dashboard
app.get("/welcome-dashboard", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "welcome-dashboard.html");
    console.log("Serving welcome-dashboard from:", filePath);
    res.sendFile(filePath);
});

// Ruta para dashboard
app.get("/dashboard", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "dashboard.html");
    console.log("Serving dashboard from:", filePath);
    res.sendFile(filePath);
});

// Ruta para task
app.get("/task", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "task.html");
    console.log("Serving task from:", filePath);
    res.sendFile(filePath);
});

app.get("/new-task", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "new-task.html");
    console.log("Serving new-task from:", filePath);
    res.sendFile(filePath);
});

// 404 handler
app.use((req, res) => {
    console.log("404 - Not found:", req.path);
    res.status(404).send(`Cannot find ${req.path}`);
});



app.use(cors({
    origin: "*", //this is temporal
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

try {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on http://localhost:" + port);
    });
} catch (err) {
    console.error(err);
}