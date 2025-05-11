import express from "express";
import validateRequest from "../../Middleware/validateRequest";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

// get all admins
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.getDoctors
);

// get admin by id
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.getDoctorById
);

// update  admin by id
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  //   validateRequest(AdminValidation.updateAdmin),
  DoctorController.updateDoctorById
);

// delete admin by id
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.deleteDoctorById
);

// soft delete admin by id
router.patch(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorController.softDeleteDoctorById
);

export const doctorRoute = router;
