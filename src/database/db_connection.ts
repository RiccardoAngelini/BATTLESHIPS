
import { Dialect, Sequelize } from "sequelize";
import { initModels } from "../models/init-models";

 class DbConnection {
  private static sequelize: Sequelize;
  private constructor() {} // Prevent instantiation

  public static async init(): Promise<Sequelize> {
    if (!DbConnection.sequelize) {
      const dbName = process.env.DB_NAME || "postgres" as string;
      const dbUser = process.env.DB_USER || "postgres" as string;
      const dbPassword = process.env.DB_PASSWORD || "postgres";
      const dbHost = process.env.DB_HOST;
      DbConnection.sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'postgres',
        logging:false
      });

      try {
        await DbConnection.sequelize.authenticate();
        console.log(" Database connection established successfully.");
        initModels(DbConnection.sequelize);
      } catch (error) {
        console.error(" Unable to connect to the database:", error);
        throw error;

      }
    }
    return DbConnection.sequelize
  
  }
  }
export default DbConnection;
  

