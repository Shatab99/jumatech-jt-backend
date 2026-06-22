import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "postgres",   // 👈 Replaced serviceName/sid with database

  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: process.env.NODE_ENV === 'dev' ? ["src/app/entities/**/*.ts"] : ["dist/app/entities/**/*.js"],
  migrations: ["src/app/migrations/**/*.ts"],
  subscribers: ["src/app/subscribers/**/*.ts"],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ TypeORM PostgreSQL connection established successfully!");
    }
    return AppDataSource;
  } catch (error: any) {
    console.error("❌ Error initializing TypeORM database:");
    console.error(error.message);
    throw error;
  }
};