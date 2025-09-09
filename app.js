import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose"; // Añadir
import cors from "cors"; // Añadir
import taskRoutes from './backend/routes/task.js';
import userRoutes from './backend/routes/user.js';
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './backend/routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname);

const app = express();

// Añadir CORS antes de otras middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`📨 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', req.body);
    }
    next();
});
// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskapp')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);  // Mover aquí
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);



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

// Ruta para nueva tarea
app.get("/new-task", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "new-task.html");
    console.log("Serving new-task from:", filePath);
    res.sendFile(filePath);
});

app.get("/reset-password", (req, res) => {
    const filePath = path.join(__dirname, "Front", "View", "reset-password.html");
    console.log("Serving reset-password from:", filePath);
    res.sendFile(filePath);
});

// ... resto de tus rutas ...

// 404 handler
app.use((req, res) => {
    console.log("404 - Not found:", req.path);
    res.status(404).send(`Cannot find ${req.path}`);
});

try {
    const port = process.env.PORT || 5100;
    app.listen(port, () => {
        console.log("✅ Server is running on http://localhost:" + port);
        console.log("📁 Serving static files from:", path.join(__dirname, "Front"));
    });
} catch (err) {
    console.error(err);
}