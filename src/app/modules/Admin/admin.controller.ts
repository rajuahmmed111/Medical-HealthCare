import httpStatus from "http-status";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AdminService } from "./admin.service";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { filterField } from "./admin.constant";
import { paginationField } from "../../../Interface/common";

// get admins
const getAdmins = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);

  const result = await AdminService.getAdmins(filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// gets admin by id
const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getAdminByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

// update  admin by id
const updateAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await AdminService.updateAdminByIdIntoDB(id, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

// delete admin by id
const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteAdminByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

// soft delete admin by id
const softDeleteAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.softDeleteAdminByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin soft deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
