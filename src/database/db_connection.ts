
import { Dialect, Sequelize } from "sequelize";
import { initModels } from "../models/init-models";

 class DbConnection {
   // Istanza singleton di Sequelize
  private static sequelize: Sequelize;
  private constructor() {} // Prevent instantiation

   /**
   * Inizializza e restituisce l’istanza di Sequelize.
   * Se già inizializzata, ritorna semplicemente quell’istanza.
   */
  public static async init(): Promise<Sequelize> {
    if (!DbConnection.sequelize) {
      // Recupera credenziali dal .env (o usa valori di default)
      const dbName = process.env.DB_NAME || "postgres" as string;
      const dbUser = process.env.DB_USER || "postgres" as string;
      const dbPassword = process.env.DB_PASSWORD || "postgres";
      const dbHost = process.env.DB_HOST || "localhost";
      DbConnection.sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'postgres',
       logging: console.log  // Disabilita i log SQL
      });

      try {
        // Verifica la connessione al database
        await DbConnection.sequelize.authenticate();
        console.log(" Database connection established successfully.");
        initModels(DbConnection.sequelize);
      } catch (error) {
        console.error(" Unable to connect to the database:", error);
        throw error;

      }
    } // Restituisce l’istanza già inizializzata
    return DbConnection.sequelize
  
  }
  }
export default DbConnection;
  

