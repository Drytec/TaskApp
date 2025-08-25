import dotenv from "dotenv";
dotenv.config();
import express from "express";
import taskRoutes from './backend/routes/task.js';
import * as bodyParser from "express";


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/task', taskRoutes);
try {
    const port = process.env.PORT || 3000;
    app.listen(port,() => {console.log("Server is running on http://localhost:" + port)});
}
catch(err) {
    console.error(err);
}
app.get("/", (req, res) => {

    res.send("index");
})
