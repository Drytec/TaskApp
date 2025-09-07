import dotenv from "dotenv";
dotenv.config();
import express from "express";
import taskRoutes from './backend/routes/task.js';
import userRoutes from './backend/routes/user.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/task', taskRoutes);
app.use('/user', userRoutes);

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
