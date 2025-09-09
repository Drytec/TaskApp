const dbClient = require("../config/dbClient.js");

// Generic Data Access Object (DAO) class for CRUD operations
class GlobalDAO {
    constructor(model) {
        // Store the Mongoose model this DAO will operate on
        this.model = model;
    }

    // Create a new document in the collection
    async create(data){
        try {
            const document = new this.model(data);
            return await document.save(); // Save the new document and return it
        } catch (error) {
            // Throw a descriptive error if creation fails
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    // Read/fetch a document by its ID
    async read(id) {
        try {
            const document = await this.model.findById(id);
            if (!document) throw new Error("Document not found"); // Handle missing document
            return document;
        } catch (error) {
            // Throw descriptive error if fetch fails
            throw new Error(`Error getting document by ID: ${error.message}`);
        }
    }

    // Update a document by its ID with new data
    async update(id, updateData) {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true } // Return updated doc & validate changes
            );
            if (!updatedDocument) throw new Error("Document not found"); // Handle missing document
            return updatedDocument;
        } catch (error) {
            // Throw descriptive error if update fails
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    }

    // Delete a document by its ID
    async delete(id) {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id);
            if (!deletedDocument) throw new Error("Document not found"); // Handle missing document
            return deletedDocument;
        } catch (error) {
            // Throw descriptive error if delete fails
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    }

    // Retrieve all documents matching an optional filter (default: all)
    async getAll(filter = {}) {
        try {
            return await this.model.find(filter);
        } catch (error) {
            // Throw descriptive error if retrieval fails
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }
}

module.exports = GlobalDAO;
