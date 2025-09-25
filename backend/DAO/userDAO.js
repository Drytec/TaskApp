const User = require("../models/user.js");
const GlobalDAO = require("./globalDAO.js");

class UserDAO extends GlobalDAO{
    constructor() {
        super(User);
    }
}

module.exports = new UserDAO();
