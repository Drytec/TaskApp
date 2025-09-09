const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using JWT token
function authMiddleware(req, res, next) {
    // Get the 'Authorization' header value
    const authHeader = req.headers["authorization"];
    // Extract token from header (expected format: "Bearer <token>")
    const token = authHeader && authHeader.split(" ")[1];

    // If token is not present, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ error: "Access denied. Token required." });
    }

    try {
        // Verify the JWT token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded user info to request object for downstream use
        req.user = decoded;
        // Continue to next middleware or route handler
        next();
    } catch (err) {
        // If token is invalid or expired, return 403 Forbidden
        res.status(403).json({ error: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
