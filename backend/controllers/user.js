const GlobalController = require("./globalController.js");
const UserDAO = require("../DAO/userDAO.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Cambiar 'user' por 'User' (mayúscula)

class UserController extends GlobalController {
    constructor() {
        super(UserDAO);
    }

    registerUser = async (req, res) => {
        console.log("📝 Attempting to register user:", req.body.email);
        try {
            const {email, password, name, lastname, age} = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({email});
            if (existingUser) {
                console.log("❌ User already exists:", email);
                return res.status(400).json({error: "El usuario ya existe"});
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                console.log("❌ Password doesn't meet requirements");
                return res.status(400).json({
                    error:
                        "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula y número"
                });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("🔒 Password hashed successfully");

            const user = new User({email, password: hashedPassword, name, lastname, age});
            await user.save();
            console.log("✅ User registered successfully:", email);

            res.status(201).json({message: "Usuario registrado exitosamente"});
        } catch (err) {
            console.error("❌ Registration error:", err.message);
            res.status(500).json({error: err.message});
        }
    };

    loginUser = async (req, res) => {
        console.log("🔐 Login attempt for:", req.body.email);
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});
            if (!user) {
                console.log("❌ User not found:", email);
                return res.status(400).json({error: "Usuario no encontrado"});
            }
            console.log("👤 User found:", email);

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log("❌ Invalid password for:", email);
                return res.status(400).json({error: "Contraseña incorrecta"});
            }

            const token = jwt.sign(
                {id: user._id, email: user.email},
                process.env.JWT_SECRET || "default_secret_key", // Fallback si no hay JWT_SECRET
                {expiresIn: process.env.JWT_EXPIRES || "1h"}
            );
            
            console.log("✅ Login successful for:", email);
            console.log("🎫 Token generated:", token.substring(0, 20) + "...");

            res.json({token});
        } catch (err) {
            console.error("❌ Login error:", err.message);
            res.status(500).json({error: err.message});
        }
    };
}

module.exports = new UserController();
