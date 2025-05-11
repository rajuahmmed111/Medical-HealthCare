import express from "express";
import validateRequest from "../../Middleware/validateRequest";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

// get all
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.getDoctors
);

// get  by id
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.getDoctorById
);

// update by id
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  //   validateRequest(AdminValidation.updateAdmin),
  DoctorController.updateDoctorById
);

// delete by id
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.deleteDoctorById
);

// soft delete by id
router.patch(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.softDeleteDoctorById
);

export const doctorRoute = router;
