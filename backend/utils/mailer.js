const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email using the configured transporter.
 * 
 * @async
 * @function sendEmail
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} html - HTML content of the email body.
 * @returns {Promise<void>} Resolves when the email has been sent.
 * @throws {Error} If sending the email fails.
 */
async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Support App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("📨 Email sent successfully");
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
}

module.exports = sendEmail;

