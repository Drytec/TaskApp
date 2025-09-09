// backend/controllers/authController.js
const crypto = require("crypto");
const User = require("../models/user.js");
const sendEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");



exports.requestPasswordReset = async (req, res) => {
    console.log("🔑 Password reset requested for:", req.body.email);
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(202).json({ message: "Si el correo existe, se enviará un enlace de recuperación." });
        }

        console.log("✅ User found:", user.email);
        
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5100"}/reset-password?token=${resetToken}`;
        console.log("🔗 Reset URL:", resetUrl);

        const html = `
            <p>Hola ${user.name},</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace siguiente (expira en 1 hora):</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Si no solicitaste esto, ignora este correo.</p>
        `;

        console.log("📧 Attempting to send email to:", user.email);
        await sendEmail(user.email, "Recuperación de contraseña - TaskApp", html);
        console.log("✅ Email sent successfully");

        return res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (err) {
        console.error("❌ requestPasswordReset error:", err);
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

