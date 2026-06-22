import { NextFunction, Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes"; 
import { ZodError } from "zod"; 
import handleZodError from "../../utils/handleZodError"; 
import ApiError from "../error/ApiErrors"; 

const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: any = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources = [];
  let errorDetails = err || null;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorDetails;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ type: "ApiError", details: err.message }];
  } else {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message || "Something went wrong!";
    errorSources = [{ type: "Error", details: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(process.env.NODE_ENV === "development" && { error: errorDetails }),
  });
};

export default GlobalErrorHandler;