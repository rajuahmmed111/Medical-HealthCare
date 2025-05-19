import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { ScheduleService } from "./schedule.service";
import { pick } from "../../../shared/pick";
import { paginationField } from "../../../Interface/common";
import { filterField } from "./schedule.constant";

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
  const doctorEmail = req.user?.doctorEmail;
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);
  const result = await ScheduleService.getAllFromDB(
    filter,
    options,
    doctorEmail
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

// get schedule by id
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { scheduleId } = req.params;
  const result = await ScheduleService.getScheduleByIdFromDB(scheduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

// delete schedule by id
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { scheduleId } = req.params;
  const result = await ScheduleService.deleteScheduleFromDB(scheduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllFromDB,
  getScheduleById,
  deleteSchedule,
};
