import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adminService } from "./admin.service";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { filterField, paginationField } from "./admin.constant";

// get admins
const getAdmins = catchAsync(async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, filterField);
    const options = pick(req.query, paginationField);

    const result = await adminService.getAdmins(filter, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.message || "Failed to create admin",
      error: err?.name,
    });
  }
});

// gets admin by id
const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getAdminByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

// update  admin by id
const updateAdminById = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await adminService.updateAdminByIdIntoDB(id, data);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin updated successfully",
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

// delete admin by id
const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteAdminByIdFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
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

// soft delete admin by id
const softDeleteAdminById = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await adminService.softDeleteAdminByIdFromDB(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin soft deleted successfully",
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
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
