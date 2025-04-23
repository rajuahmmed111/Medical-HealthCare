import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../Middleware/validateRequest";
import { AdminValidation } from "./zod.validate";
const router = express.Router();

// get all admins
router.get("/", adminController.getAdmins);

// get admin by id
router.get("/:id", adminController.getAdminById);

// update  admin by id
router.patch(
  "/:id",
  validateRequest(AdminValidation.updateAdmin),
  adminController.updateAdminById
);

// delete admin by id
router.delete("/:id", adminController.deleteAdminById);

// soft delete admin by id
router.patch("/soft/:id", adminController.softDeleteAdminById);

export const adminRoute = router;
