import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { ScheduleService } from "./schedule.service";

// create schedule
const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ScheduleService.createSchedule(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

// get all schedule
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.getAllFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllFromDB,
};
