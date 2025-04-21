import express from "express";
import { userController } from "./user.controller";
const router = express.Router();

// get by user role
router.post("/", userController.createAdmin);

export const userRoute = router;
