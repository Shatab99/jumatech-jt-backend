import "reflect-metadata";
import { Server } from "http";
import config from "./config/index";

import app from "./app";
import { connectDB } from "./app/DB/dbConnection";
import client from "./config/redis.config";
import { initBackgroundJobs } from "./app/jobs/main";


const port = config.port || 5000;

async function main() {
  await client.connect();
  await connectDB();
  await initBackgroundJobs();
  const server: Server = app.listen(port, () => {
    console.log("Sever is running on port ", port);
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();