import httpStatus from "http-status";
import catchAsync from "../../../Utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../../Utils/sendResponse";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { filterField } from "./user.constant";
import { paginationField } from "../../../Interface/common";

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

// get all users
const getAllUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);
  const result = await userService.getAllUsersFromDB(filter, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

// update profile status
const updateProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await userService.updateProfileStatus(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile status updated successfully",
    data: result,
  });
});

// get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await userService.getMyProfile(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My profile retrieved successfully",
    data: result,
  });
});

// update my profile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await userService.updateMyProfile(id, req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My profile updated successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  updateProfileStatus,
  getMyProfile,
  updateMyProfile,
};
