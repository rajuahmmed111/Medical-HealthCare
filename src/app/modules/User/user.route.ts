import express from "express";
import { userController } from "./user.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { uploadFile } from "../../../Helpers/fileUpload";
import { parseBodyData } from "../../Middleware/parseBodyData";
import validateRequest from "../../Middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

// get all users
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllUsersFromDB
);

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

// update profile status
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.updateProfileStatus),
  userController.updateProfileStatus
);

// get my profile
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  userController.getMyProfile
);

// update my profile
router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  uploadFile.profileImage,
  parseBodyData,
  // validateRequest(UserValidation.updateMyProfile),
  userController.updateMyProfile
);

export const userRoute = router;
