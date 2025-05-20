import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AppointmentService } from "./appointment.service";
import { pick } from "../../../shared/pick";
import { paginationField } from "../../../Interface/common";
import { filterField } from "./appointment.constant";

// create appointment
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
  const user = req.user;
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);
  const result = await AppointmentService.getMyAppointments(
    user,
    filter,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

// get all appointments
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationField);
  const result = await AppointmentService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointments,
  getAllFromDB,
};
