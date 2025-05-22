import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../Middleware/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

// get all appointments
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppointmentController.getAllFromDB
);

// get my appointment
router.get(
  "/my",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointments
);

// create appointments
router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

export const appointmentRoute = router;
