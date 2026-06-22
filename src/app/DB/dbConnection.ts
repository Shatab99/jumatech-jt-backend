import { initializeDatabase } from "./database.config";

export const connectDB = async () => {
    try {
        await initializeDatabase();
        // No need for a separate DatabaseConnection wrapper function
        // The log in initializeDatabase is sufficient
    } catch (error: any) {
        console.error(`❌ Database Connection Error: ${error?.message}`);
        // Print the full error stack to debug Oracle specific codes (ORA-XXXX)
        console.error(error); 
        process.exit(1); 
    }
};