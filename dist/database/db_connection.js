"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const init_models_1 = require("../models/init-models");
class DbConnection {
    constructor() { } // Prevent instantiation
    static async init() {
        if (!DbConnection.sequelize) {
            const dbName = process.env.DB_NAME;
            const dbUser = process.env.DB_USER;
            const dbPassword = process.env.DB_PASSWORD;
            const dbHost = process.env.DB_HOST;
            DbConnection.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
                host: dbHost,
                dialect: 'postgres',
                logging: false
            });
            try {
                await DbConnection.sequelize.authenticate();
                console.log(" Database connection established successfully.");
                (0, init_models_1.initModels)(DbConnection.sequelize);
            }
            catch (error) {
                console.error(" Unable to connect to the database:", error);
                throw error;
            }
        }
        return DbConnection.sequelize;
    }
}
exports.default = DbConnection;
