import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// create doctor schedule
router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

export const doctorScheduleRoute = router;
