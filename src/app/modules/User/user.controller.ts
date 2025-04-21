import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";

// get by user role
const getUserByRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.params;
  console.log(role);
  const result = await UserService.getUserByRole(role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "get user by role successfully",
    data: result,
  });
});

export const UserController = {
  getUserByRole,
};
