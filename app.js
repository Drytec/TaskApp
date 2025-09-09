// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Import required modules
import express from "express";
import taskRoutes from './backend/routes/task.js';
import path from "path";
import { fileURLToPath } from "url";

// Use CommonJS modules (mixed with ESM)
const { connectDB } = require("./backend/config/dbClient.js");
const cors = require("cors");
const routes = require("./backend/routes/routes.js");

// Resolve __dirname and __filename in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname); // Debug: Print current directory

// Create an instance of the Express application
const app = express();

// Enable parsing of JSON bodies in requests
app.use(express.json());

// Enable parsing of URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Logging middleware to print HTTP method and path for each request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve static files (HTML, CSS, JS, etc.) from the "Front" folder
app.use(express.static(path.join(__dirname, "Front")));

// Redirect root URL ("/") to the login page
app.get("/", (req, res) => {
    console.log("Redirecting to /login");
    res.redirect("/login");
});

// Serve the login page
app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "login.html");
    console.log("Serving login from:", filePath);
    res.sendFile(filePath);
});

// Serve the signup page
app.get("/signup", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "signup.html");
    console.log("Serving signup from:", filePath);
    res.sendFile(filePath);
});

// Serve the password recovery page
app.get("/password-recovery", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "password-recovery.html");
    console.log("Serving password-recovery from:", filePath);
    res.sendFile(filePath);
});

// Serve the welcome dashboard page (shown after successful login)
app.get("/welcome-dashboard", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "welcome-dashboard.html");
    console.log("Serving welcome-dashboard from:", filePath);
    res.sendFile(filePath);
});

// Serve the main dashboard page
app.get("/dashboard", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "dashboard.html");
    console.log("Serving dashboard from:", filePath);
    res.sendFile(filePath);
});

// Serve the task page
app.get("/task", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "task.html");
    console.log("Serving task from:", filePath);
    res.sendFile(filePath);
});

// Serve the new task creation page
app.get("/new-task", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "new-task.html");
    console.log("Serving new-task from:", filePath);
    res.sendFile(filePath);
});

// Handle 404 errors - page not found
app.use((req, res) => {
    console.log("404 - Not found:", req.path);
    res.status(404).send(`Cannot find ${req.path}`);
});

// Enable CORS (Cross-Origin Resource Sharing)
// This allows requests from any origin (temporary setup)
app.use(cors({
    origin: "*", // Temporary – update this for production use
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Start the server
try {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server is running on http://localhost:" + port);
    });
} catch (err) {
    // Log any errors that occur during server startup
    console.error(err);
}
