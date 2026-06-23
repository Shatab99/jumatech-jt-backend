import { initializeDatabase } from "./database.config";

export const connectDB = async () => {
    try {
        await initializeDatabase();
    } catch (error: any) {
        console.error(`❌ Database Connection Error: ${error?.message}`);
        console.error(error);
        process.exit(1);
    }
};