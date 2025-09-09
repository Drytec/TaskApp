const User = require("../models/user.js");  // Import the User Mongoose model
const GlobalDAO = require("./globalDAO.js"); // Import the generic GlobalDAO class

// UserDAO extends GlobalDAO to handle User-specific database operations
class UserDAO extends GlobalDAO {
    constructor() {
        super(User);  // Pass the User model to the parent class constructor
    }
}

module.exports = new UserDAO(); // Export an instance of UserDAO

