import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../Utils/sendResponse";
import { pick } from "../../../shared/pick";
import { paginationField } from "../../../Interface/common";
import { filterField } from "./doctorSchedule.constant";

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const email = req.user.email;
  const data = req.body;
  const result = await DoctorScheduleService.createDoctorSchedule(email, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

// get my schedule
const getMySchedule = catchAsync(async (req: Request, res: Response) => {
  const email = req.user.email;
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);
  const result = await DoctorScheduleService.getMySchedule(email,filter,options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Schedule retrieved successfully",
    data: result,
  });
})

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMySchedule
};
