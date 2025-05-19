import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AppointmentService.createAppointment(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

export const AppointmentController = { createAppointment };
