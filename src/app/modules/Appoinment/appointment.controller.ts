import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const patientEmail = req.user?.email;
  const data = req.body;
  const result = await AppointmentService.createAppointment(patientEmail, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

// get my appointments
const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const patientEmail = req.user?.email;
  const result = await AppointmentService.getMyAppointments(patientEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

export const AppointmentController = { createAppointment, getMyAppointments };
