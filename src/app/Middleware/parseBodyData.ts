import { NextFunction, Request, Response } from "express";

export const parseBodyData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body.data) {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "Invalid JSON format in bodyData",
      });
      return;
    }
  }
  next();
};
