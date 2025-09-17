// Dependencias principales
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./backend/config/dbClient.js");
const userRoutes = require("./backend/routes/user"); // Tus rutas de usuarios

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Cargar variables de entorno
require("dotenv").config();

// Crear aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Logs de peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "Front")));

// Vistas HTML (Front)
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "signup.html")));
app.get("/password-recovery", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "password-recovery.html")));
app.get("/welcome-dashboard", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "welcome-dashboard.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "dashboard.html")));
app.get("/task", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "task.html")));
app.get("/new-task", (req, res) => res.sendFile(path.join(__dirname, "Front", "View", "new-task.html")));

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MiniProyecto1 API",
      version: "1.0.0",
      description: "API for managing users and tasks with Node.js, Express, and MongoDB",
    },
    servers: [
      {
        url: "http://localhost:5100/api",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Operations related to users",
      },
      {
        name: "Tasks",
        description: "Operations related to tasks",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./backend/routes/*.js"], // your documented endpoints
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/users", userRoutes);

// 404 Error handling
app.use((req, res) => {
  res.status(404).send(`Route ${req.path} not found`);
});

// Connect to DB
connectDB();

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Documentation available at http://localhost:${port}/api-docs`);
});

module.exports = app;

