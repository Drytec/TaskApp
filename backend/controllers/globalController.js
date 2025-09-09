// GlobalController is a generic controller class that handles
// basic CRUD (Create, Read, Update, Delete) operations using a DAO (Data Access Object)

class GlobalController {
    // Constructor receives a DAO instance to perform database operations
    constructor(dao) {
        this.dao = dao;
    }

    // Create a new item with data from the request body
    async create(req, res) {
        console.log("Creating item with data:", req.body);
        try {
            const item = await this.dao.create(req.body);
            res.status(201).json(item);  // Respond with created item and HTTP 201 status
        } catch (error) {
            res.status(400).json({ message: error.message }); // Handle errors with HTTP 400
        }
    }

    // Read (retrieve) a single item by ID (from request params)
    async read(req, res) {
        try {
            const item = await this.dao.read(req.params.id);
            res.status(200).json(item); // Respond with the found item and HTTP 200
        } catch (error) {
            res.status(404).json({ message: error.message }); // Handle "not found" errors with HTTP 404
        }
    }

    // Update an existing item identified by ID with data from request body
    async update(req, res) {
        try {
            const item = await this.dao.update(req.params.id, req.body);
            res.status(200).json(item); // Respond with the updated item and HTTP 200
        } catch (error) {
            res.status(400).json({ message: error.message }); // Handle validation or update errors with HTTP 400
        }
    }

    // Delete an item by ID
    async delete(req, res) {
        try {
            const item = await this.dao.delete(req.params.id);
            res.status(200).json(item); // Respond with deleted item or confirmation, HTTP 200
        } catch (error) {
            res.status(404).json({ message: error.message }); // Handle "not found" errors with HTTP 404
        }
    }

    // Retrieve all items, optionally filtered by query parameters
    async getAll(req, res) {
        try {
            const items = await this.dao.getAll(req.query);
            res.status(200).json(items); // Respond with array of items and HTTP 200
        } catch (error) {
            res.status(400).json({ message: error.message }); // Handle errors with HTTP 400
        }
    }
}

module.exports = GlobalController;
