import express from "express";
import { adminController } from "./admin.controller";
const router = express.Router();

// get by user role
router.get("/", adminController.getAdmins);

export const adminRoute = router;