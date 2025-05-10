import express from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../Middleware/validateRequest";
import { AdminValidation } from "./zod.validate";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

// get all admins
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAdmins
);

// get admin by id
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAdminById
);

// update  admin by id
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(AdminValidation.updateAdmin),
  AdminController.updateAdminById
);

// delete admin by id
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdminById
);

// soft delete admin by id
router.patch(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteAdminById
);

export const adminRoute = router;
