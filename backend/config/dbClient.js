
/**
 * @file db.js
 * @description Module responsible for connecting and disconnecting the application to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connects the application to MongoDB using the URI defined in environment variables.
 * 
 * @async
 * @function connectDB
 * @throws {Error} Throws an error if the database connection cannot be established.
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};




/**
 * Disconnects the application from MongoDB.
 * 
 * @async
 * @function disconnectDB
 * @throws {Error} Throws an error if disconnecting fails.
 * @returns {Promise<void>} Resolves when the disconnection is successful.
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
        throw error; // <-- Esto es importante para que JSDoc se cumpla
    }
}; 

module.exports = { connectDB, disconnectDB };

