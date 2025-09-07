
import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import bcrypt from "bcrypt";

class UserModel {
    constructor() {}

    // Crear nuevo usuario (con contraseña hasheada)
    async createUser(user) {
        const collUser = dbClient.db.collection("users");

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = {
            username: user.username,
            email: user.email,
            password: hashedPassword,
            createdAt: new Date()
        };

        return await collUser.insertOne(newUser);
    }

    // Obtener todos los usuarios (opcional, por seguridad)
    async getAllUsers() {
        const collUser = dbClient.db.collection("users");
        return await collUser.find({}).toArray();
    }

    // Obtener un usuario por ID
    async getUserById(id) {
        const collUser = dbClient.db.collection("users");
        return await collUser.findOne({ _id: new ObjectId(id) });
    }

    // Obtener un usuario por email (útil para login)
    async getUserByEmail(email) {
        const collUser = dbClient.db.collection("users");
        return await collUser.findOne({ email: email });
    }

    // Eliminar un usuario (opcional)
    async deleteUser(id) {
        const collUser = dbClient.db.collection("users");
        return await collUser.deleteOne({ _id: new ObjectId(id) });
    }
}

export default new UserModel();
