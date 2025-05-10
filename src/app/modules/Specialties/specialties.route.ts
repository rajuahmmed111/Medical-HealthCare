import express from "express";
import { SpecialtiesController } from "./specialties.controller";
import validateRequest from "../../Middleware/validateRequest";
import { SpecialtiesValidation } from "./specialties.validation";
import { uploadFile } from "../../../Helpers/fileUpload";
import { parseBodyData } from "../../Middleware/parseBodyData";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// create specialties
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.specialtiesIcon,
  parseBodyData,
  validateRequest(SpecialtiesValidation.createSpecialties),
  SpecialtiesController.createSpecialties
);

export const specialtiesRoute = router;
