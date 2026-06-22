import { Response } from "express";

const sendResponse = <T>(
  res: Response, statusCode: number, message: string, data?: T | null | undefined
) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data || null || undefined,
  });
};

export default sendResponse;