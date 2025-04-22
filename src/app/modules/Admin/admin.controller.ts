import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adminService } from "./admin.service";
import { Request, Response } from "express";

// get admins
const getAdmins = catchAsync(async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const result = await adminService.getAdmins(searchTerm);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins retrieved successfully",
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

export const adminController = {
  getAdmins,
};
