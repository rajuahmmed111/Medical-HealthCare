import express from "express";
import { userController } from "./user.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { uploadFile } from "../../../Helpers/fileUpload";
import { parseBodyData } from "../../Middleware/parseBodyData";
import validateRequest from "../../Middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

// create admin
router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.profileImage,
  parseBodyData, // must come before validation
  validateRequest(UserValidation.createAdmin),
  userController.createAdmin
);

// create doctor
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.profileImage,
  parseBodyData, // must come before validation
  validateRequest(UserValidation.createDoctor),
  userController.createDoctor
);

// create patient
router.post(
  "/create-patient",
  uploadFile.profileImage,
  parseBodyData, // must come before validation
  validateRequest(UserValidation.createPatient),
  userController.createPatient
);

// get all users
router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllUsers
);

export const userRoute = router;
