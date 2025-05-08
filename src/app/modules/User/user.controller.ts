import httpStatus from "http-status";
import catchAsync from "../../../Utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../../Utils/sendResponse";
import { Request, Response } from "express";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin created successfully",
    data: result,
  });
});

// create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor created successfully",
    data: result,
  });
});

// create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient created successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient
};
