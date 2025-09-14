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

// Swagger configuración
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MiniProyecto1 API",
      version: "1.0.0",
      description: "API de gestión de usuarios y tareas con Node.js, Express y MongoDB",
    },
    servers: [
      {
        url: "http://localhost:5100/api",
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Operaciones relacionadas con usuarios",
      },
      {
        name: "Tasks",
        description: "Operaciones relacionadas con tareas",
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
  apis: ["./backend/routes/*.js"], // tus endpoints documentados 
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use("/api/users", userRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`No se encontró la ruta ${req.path}`);
});

// Conectar a la BD
connectDB();

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Documentación en http://localhost:${port}/api-docs`);
});

module.exports = app;

