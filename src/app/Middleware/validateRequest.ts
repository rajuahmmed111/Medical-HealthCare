import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body); // 🔄 use req.body directly
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          errors: err.errors,
        });
        return;
      }
      next(err);
    }
  };
};

export default validateRequest;
