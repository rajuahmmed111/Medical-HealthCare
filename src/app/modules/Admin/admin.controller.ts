import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adminService } from "./admin.service";
import { Request, Response } from "express";

// get admins
const getAdmins = catchAsync(async (req: Request, res: Response) => {
    const { searchTerm } = req.query;
    // console.log(searchTerm);
  const result = await adminService.getAdmins(searchTerm);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getAdmins,
};
