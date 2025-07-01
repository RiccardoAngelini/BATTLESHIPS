"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const init_models_1 = require("../models/init-models");
class DbConnection {
    constructor() { } // Prevent instantiation
    /**
    * Inizializza e restituisce l’istanza di Sequelize.
    * Se già inizializzata, ritorna semplicemente quell’istanza.
    */
    static async init() {
        if (!DbConnection.sequelize) {
            // Recupera credenziali dal .env (o usa valori di default)
            const dbName = process.env.DB_NAME || "postgres";
            const dbUser = process.env.DB_USER || "postgres";
            const dbPassword = process.env.DB_PASSWORD || "postgres";
            const dbHost = process.env.DB_HOST || "localhost";
            DbConnection.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
                host: dbHost,
                dialect: 'postgres',
                logging: console.log // Disabilita i log SQL
            });
            try {
                // Verifica la connessione al database
                await DbConnection.sequelize.authenticate();
                console.log(" Database connection established successfully.");
                (0, init_models_1.initModels)(DbConnection.sequelize);
            }
            catch (error) {
                console.error(" Unable to connect to the database:", error);
                throw error;
            }
        } // Restituisce l’istanza già inizializzata
        return DbConnection.sequelize;
    }
}
exports.default = DbConnection;
