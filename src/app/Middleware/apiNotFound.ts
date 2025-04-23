import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

const ApiNotFound = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      method: req.method,
      message: "Your requested path is not found!",
    },
  });
};

export default ApiNotFound;
