const nodemailer = require("nodemailer");

// Create a transporter object using Gmail service and authentication details from environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Email user from environment variables
        pass: process.env.EMAIL_PASS   // Email password from environment variables
    }
});

// Function to send an email
async function sendEmail(to, subject, html) {
    try {
        // Send email with specified parameters
        await transporter.sendMail({
            from: `"Support App" <${process.env.EMAIL_USER}>`, // Sender info
            to,      // Recipient email
            subject, // Email subject
            html     // Email content in HTML format
        });
        console.log("📨 Email sent successfully");
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
}

module.exports = sendEmail;

