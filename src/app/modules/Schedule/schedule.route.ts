import express from "express";
import validateRequest from "../../Middleware/validateRequest";
import { uploadFile } from "../../../Helpers/fileUpload";
import { parseBodyData } from "../../Middleware/parseBodyData";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

// create schedule
router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.createSchedule);

export const scheduleRoute = router;
