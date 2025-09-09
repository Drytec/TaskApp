// This file defines the database connection logic using Mongoose

// Import Mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Load environment variables from .env file (e.g., MONGO_URI)
require("dotenv").config();

/**
 * Connects to the MongoDB database using the URI stored in the environment variable.
 * If the connection is successful, a message is logged.
 * If it fails, the error is printed and the process exits.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,        // Use the new URL parser (modern option)
            useUnifiedTopology: true,     // Use the new server discovery and monitoring engine
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the app if connection fails
    }
};

/**
 * Gracefully disconnects from the MongoDB database.
 * Logs the result or any error that occurs.
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
    }
};

// Export both functions to be used in other parts of the app
module.exports = { connectDB, disconnectDB };
