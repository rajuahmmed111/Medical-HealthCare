import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin created successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
};
