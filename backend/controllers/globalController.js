/**
 * Generic controller with basic CRUD operations.
 * @class
 */
class GlobalController {
    /**
     * @constructor
     * @param {Object} dao - Data Access Object with data access methods.
     */
    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Create a new document.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async create(req, res) {
        console.log("Creating item with data:", req.body);
        try {
            const item = await this.dao.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Read a document by ID.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    async read(req, res) {
        try {
            const item = await this.dao.read(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    /**
     * Update a document by ID.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    async update(req, res) {
        try {
            const item = await this.dao.update(req.params.id, req.body);
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Delete a document by ID.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    async delete(req, res) {
        try {
            const item = await this.dao.delete(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    /**
     * Get all documents, optionally filtered.
     * @async
     * @param {Object} req
     * @param {Object} res
     */
    async getAll(req, res) {
        try {
            const items = await this.dao.getAll(req.query);
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = GlobalController;


