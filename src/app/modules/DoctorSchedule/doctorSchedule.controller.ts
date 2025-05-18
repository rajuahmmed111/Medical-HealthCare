import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../Utils/sendResponse";

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

export const DoctorScheduleController = {
  createDoctorSchedule,
};
