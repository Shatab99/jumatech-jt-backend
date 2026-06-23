import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import NodeCache from "node-cache";
import router from "./app/route/route";
import GlobalErrorHandler from "./app/middleware/globalErrorHandler";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import { swaggerSpec, swaggerUiOptions } from "./config/swaggerConfig";
import compression from 'compression';
import { connectDB } from "./app/DB/dbConnection";
import { AuthController } from "./app/modules/Auth/auth.controller";
import { checkClient } from "./app/middleware/checkClient";

export const myCache = new NodeCache({ stdTTL: 300 });
const app = express();


app.use("/media", express.static(path.join(process.cwd(), "media")));
app.use(morgan("dev")); // 'dev' is a predefined format
app.use(express.json());
app.use(compression())

app.get("/", (req, res) => {
  res.json({
    success: true,
    title: `${process.env.CLIENT_NAME} API`,
    message: "Hello World!",
  });
});

const uploadPath = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("Uploads folder created successfully!");
}

app.use("/uploads", express.static(uploadPath));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://jumatechjt.shatab.me'
  ]
}));
app.use("/api/token", AuthController.accessToken)
app.use("/api/v1", checkClient, router);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);
app.use(GlobalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
