// controllers/user.js
const GlobalController = require("./globalController.js");
const UserDAO = require("../DAO/userDAO.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

class UserController extends GlobalController {
    constructor() {
        super(UserDAO);
    }

    registerUser = async (req, res) => {
        try {
            const { email, password, name, lastname, age } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email y contraseña son requeridos" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, name, lastname, age });
            await user.save();

            return res.status(201).json({ message: "Usuario registrado exitosamente" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    };

    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email y contraseña son requeridos" });
            }

            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ error: "Contraseña incorrecta" });

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES || "1h" }
            );

            return res.json({ token });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new UserController();
