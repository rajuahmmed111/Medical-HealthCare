import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get my appointment
router.get(
  "/my",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointments
);

// create appointment
router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);

export const appointmentRoute = router;
