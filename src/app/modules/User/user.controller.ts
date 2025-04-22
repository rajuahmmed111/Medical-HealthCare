import httpStatus from "http-status";
import catchAsync from "../../../Utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../../Utils/sendResponse";
import { Request, Response } from "express";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.message || "Failed to create admin",
      error: err?.name,
    });
  }
});

export const userController = {
  createAdmin,
};
