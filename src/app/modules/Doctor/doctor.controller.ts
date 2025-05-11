import httpStatus from "http-status";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { DoctorService } from "./doctor.service";
import { paginationField } from "../../../Interface/common";
import { filterField } from "./doctor.constant";

// get doctors
const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);

  const result = await DoctorService.getDoctors(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// gets doctor by id
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getDoctorByIdFromDB(id);

  sendResponse(res, {
    statusCode:httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

// update  doctor by id
const updateDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await DoctorService.updateDoctorByIdIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

// delete doctor by id
const deleteDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctorByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

// soft delete doctor by id
const softDeleteDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDeleteDoctorByIdFromDB(id);

  sendResponse(res, {
    statusCode:httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  softDeleteDoctorById,
};
