/**
 * @file userDAO.js
 * @description DAO class for User model, extending GlobalDAO.
 */

const User = require("../models/user.js");
const GlobalDAO = require("./globalDAO.js");

/**
 * DAO class to handle CRUD operations for the User model.
 * Inherits all methods from GlobalDAO.
 */
class UserDAO extends GlobalDAO {
    constructor() {
        super(User);
    }
}

module.exports = new UserDAO();
