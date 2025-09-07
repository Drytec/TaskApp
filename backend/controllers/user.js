// controllers/UserController.js
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
    constructor() {}

    async registerUser(req, res) {
        try {
            const { username, email, password } = req.body;

            // Verificar si ya existe
            const existing = await UserModel.getUserByEmail(email);
            if (existing) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }

            // Crear usuario
            const user = await UserModel.createUser({ username, email, password });

            res.status(201).json({ message: "Usuario registrado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.getUserByEmail(email);
            if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });

            // Crear token
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    }
}

export default new UserController();
