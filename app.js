const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./backend/config/dbClient.js");
const routes = require("./backend/routes/routes.js");

dotenv.config();

const app = express();


app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://task-app-front-mu.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

try {
    connectDB();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("✅ Server running at http://localhost:" + port);
    });
} catch (err) {
    console.error("❌ Error starting server:", err);
}

app.get("/", (req, res) => {
    res.send("Backend API is running 🚀");
});
