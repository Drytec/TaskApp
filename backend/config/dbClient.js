//Here the DBA will create the connection to db
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

class dbClient {
    constructor() {
        // replace with de conexion to mongodb
        const queryString = process.env.MONGO_URI;
        this.client = new MongoClient(queryString);
        this.db = null;

        this.connectBD();
    }

    async connectBD() {
        try {
            await this.client.connect();
            this.db = this.client.db("TicTask"); 
            console.log("✅ Conectado a MongoDB Atlas");
            return this.db;
        } catch (e) {
            console.error(" Error conectando a MongoDB:", e);
        }
    }

    async closeBD() {
        try {
            await this.client.close();
            console.log(" Conexión cerrada");
        } catch (e) {
            console.error("Error cerrando la conexión:", e);
        }
    }
}

export default dbClient;
