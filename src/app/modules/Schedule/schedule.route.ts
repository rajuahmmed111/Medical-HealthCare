import express from "express";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

// get all schedule
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllFromDB
);

// get schedule by id
router.get(
  "/:scheduleId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getScheduleById
);



// create schedule
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.createSchedule
);


// delete schedule
router.delete(
  "/:scheduleId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.deleteSchedule
);

export const scheduleRoute = router;
