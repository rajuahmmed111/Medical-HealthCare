import express from "express";
import { SpecialtiesController } from "./specialties.controller";
import validateRequest from "../../Middleware/validateRequest";
import { SpecialtiesValidation } from "./specialties.validation";
import { uploadFile } from "../../../Helpers/fileUpload";
import { parseBodyData } from "../../Middleware/parseBodyData";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get all Specialties
router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  SpecialtiesController.getAllFromDB
);

// create specialties
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.specialtiesIcon,
  parseBodyData,
  validateRequest(SpecialtiesValidation.createSpecialties),
  SpecialtiesController.createSpecialties
);

// delete specialties
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB
);
export const specialtiesRoute = router;
