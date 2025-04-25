import express from "express";
import { userController } from "./user.controller";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

// get by user role
router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.createAdmin);

export const userRoute = router;
