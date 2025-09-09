const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./backend/config/dbClient.js")

const path = require("path");

const routes = require("./backend/routes/routes.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", routes);

try {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server running at http://localhost:" + port);
    });

    connectDB();
} catch (err) {
    console.error(err);
}


app.get("/", (req, res) => {
    res.send("index");
});