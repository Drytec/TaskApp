// backend/controllers/authController.js
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");



exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(202).json({ message: "Si el correo existe, se enviará un enlace de recuperación." });
        }


        const resetToken = crypto.randomBytes(32).toString("hex");


        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset?token=${resetToken}`;

        const html = `
      <p>Hola ${user.name},</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace siguiente (expira en 1 hora):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste esto, ignora este correo.</p>
    `;
        await sendEmail(user.email, "Recuperación de contraseña", html);

        return res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (err) {
        console.error("requestPasswordReset error:", err);
        return res.status(500).json({ error: "Inténtalo de nuevo más tarde" });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (!token) return res.status(400).json({ error: "Token requerido" });
        if (!newPassword || !confirmPassword) return res.status(400).json({ error: "Rellena las contraseñas" });
        if (newPassword !== confirmPassword) return res.status(400).json({ error: "Las contraseñas no coinciden" });


        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula y número"
            });
        }


        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");


        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ error: "Enlace inválido o caducado" });


        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);


        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;


        user.passwordChangedAt = Date.now();

        await user.save();


        return res.status(200).json({ message: "Contraseña actualizada" });
    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ error: "Inténtalo de nuevo más tarde" });
    }
};

