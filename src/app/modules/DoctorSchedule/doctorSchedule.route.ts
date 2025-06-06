import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get all doctor schedule
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorScheduleController.getAllFromDB
);

// get my schedule
router.get(
  "/my",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

// create doctor schedule
router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

// delete schedule
router.delete(
  "/:scheduleId",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteSchedule
);

export const doctorScheduleRoute = router;
