import express from "express";
import { AppointmentController } from "./appointment.controller";

const router = express.Router();

// create appointment
router.post("/", AppointmentController.createAppointment);

export const appointmentRoute = router;
