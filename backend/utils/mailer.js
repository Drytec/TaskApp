const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Soporte App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("📨 Correo enviado correctamente");
    } catch (err) {
        console.error("❌ Error enviando correo:", err);
    }
}

module.exports = sendEmail;
