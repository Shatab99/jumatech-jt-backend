import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV || "development",
    // Oracle Database Configuration
    oracle: {
        host: process.env.ORACLE_HOST || "localhost",
        port: parseInt(process.env.ORACLE_PORT || "1521"),
        user: process.env.ORACLE_USER || "system",
        password: process.env.ORACLE_PASSWORD || "",
        database: process.env.ORACLE_DB || "XE",
    },
    secretToken: process.env.SECRET_TOKEN   
}