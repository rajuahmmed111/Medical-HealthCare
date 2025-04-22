import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";

const GlobalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error?.message || "Something went wrong",
    error: error?.name,
  });

  
};

export default GlobalErrorHandler;
