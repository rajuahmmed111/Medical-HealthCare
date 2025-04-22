import express from "express";
import { adminController } from "./admin.controller";
const router = express.Router();

// gets all admins
router.get("/", adminController.getAdmins);

// gets a single admin by id
router.get("/:id", adminController.getAdminById);

export const adminRoute = router;