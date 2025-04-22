import express from "express";
import { adminController } from "./admin.controller";
const router = express.Router();

// get all admins
router.get("/", adminController.getAdmins);

// get admin by id
router.get("/:id", adminController.getAdminById);

// update  admin by id
router.patch("/:id", adminController.updateAdminById);

export const adminRoute = router;