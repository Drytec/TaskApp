/**
 * @file globalDAO.js
 * @description Generic Data Access Object (DAO) class to handle CRUD operations for any Mongoose model.
 */

const dbClient = require("../config/dbClient.js");

/**
 * Generic DAO class to interact with MongoDB collections.
 * Provides common CRUD methods (create, read, update, delete, getAll).
 */
class GlobalDAO {
    /**
     * @constructor
     * @param {Object} model - The Mongoose model to be used in the DAO.
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Creates a new document in the database.
     * @async
     * @param {Object} data - The data for the new document.
     * @returns {Promise<Object>} The created document.
     * @throws {Error} If the creation fails.
     */
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    /**
     * Retrieves a document by its ID.
     * @async
     * @param {string} id - The ID of the document to retrieve.
     * @returns {Promise<Object>} The requested document.
     * @throws {Error} If the document is not found or retrieval fails.
     */
    async read(id) {
        try {
            const document = await this.model.findById(id);
            if (!document) throw new Error("Document not found");
            return document;
        } catch (error) {
            throw new Error(`Error getting document by ID: ${error.message}`);
        }
    }

    /**
     * Updates a document by its ID.
     * @async
     * @param {string} id - The ID of the document to update.
     * @param {Object} updateData - The updated data.
     * @returns {Promise<Object>} The updated document.
     * @throws {Error} If the document is not found or update fails.
     */
    async update(id, updateData) {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedDocument) throw new Error("Document not found");
            return updatedDocument;
        } catch (error) {
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    }

    /**
     * Deletes a document by its ID.
     * @async
     * @param {string} id - The ID of the document to delete.
     * @returns {Promise<Object>} The deleted document.
     * @throws {Error} If the document is not found or deletion fails.
     */
    async delete(id) {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id);
            if (!deletedDocument) throw new Error("Document not found");
            return deletedDocument;
        } catch (error) {
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    }

    /**
     * Retrieves all documents that match a given filter.
     * @async
     * @param {Object} [filter={}] - The filter criteria.
     * @returns {Promise<Array<Object>>} A list of documents.
     * @throws {Error} If retrieval fails.
     */
    async getAll(filter = {}) {
        try {
            return await this.model.find(filter);
        } catch (error) {
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }
}

module.exports = GlobalDAO;




