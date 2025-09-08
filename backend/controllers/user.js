
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

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ email, password: hashedPassword,name,lastname, age });
            await user.save();

            res.status(201).json({ message: "Usuario registrado exitosamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ error: "Contraseña incorrecta" });

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES || "1h" }
            );

            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    recoverPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (user) {
                // Generar token
                const resetToken = jwt.sign(
                    { id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                // Guardar token en usuario
                user.resetToken = resetToken;
                user.resetTokenExpire = Date.now() + 3600000; // 1 hora
                await user.save();

                // Simular envío de correo
                console.log(`Enlace de recuperación: http://localhost:5173/reset?token=${resetToken}`);
            }

            // Siempre devolver 202 para no filtrar cuentas
            res.status(202).json({
                message: "Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación."
            });
        } catch (err) {
            res.status(500).json({ error: "Inténtalo de nuevo más tarde" });
            if (process.env.NODE_ENV === "development") console.error(err);
        }
    };

    resetPassword = async (req, res) => {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "Las contraseñas no coinciden" });
            }

            // Validación de seguridad de contraseña
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regex.test(newPassword)) {
                return res.status(400).json({
                    error: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número."
                });
            }

            // Verificar token
            let payload;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET);
            } catch (e) {
                return res.status(400).json({ error: "Enlace inválido o caducado" });
            }

            const user = await User.findById(payload.id);
            if (!user || user.resetToken !== token || user.resetTokenExpire < Date.now()) {
                return res.status(400).json({ error: "Enlace inválido o caducado" });
            }

            // Actualizar contraseña
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = undefined;
            user.resetTokenExpire = undefined;
            await user.save();

            res.status(200).json({ message: "Contraseña actualizada" });
        } catch (err) {
            res.status(500).json({ error: "Inténtalo de nuevo más tarde" });
            if (process.env.NODE_ENV === "development") console.error(err);
        }
    };


}
module.exports = new UserController();
