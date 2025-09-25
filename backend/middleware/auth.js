/**
 * @file authMiddleware.js
 * @description Middleware to authenticate requests using JSON Web Tokens (JWT).
 */

const jwt = require("jsonwebtoken");

/**
 * Authentication middleware for Express routes.
 * Validates the presence and validity of a JWT in the Authorization header.
 *
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {void} Sends a 401 or 403 response if the token is missing or invalid; otherwise, passes control to the next middleware.
 *
 * @example
 * // Protect a route
 * const express = require("express");
 * const authMiddleware = require("./middleware/authMiddleware");
 *
 * const router = express.Router();
 *
 * router.get("/protected", authMiddleware, (req, res) => {
 *   res.json({ message: "Access granted", user: req.user });
 * });
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token required." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
}

module.exports = authMiddleware;
