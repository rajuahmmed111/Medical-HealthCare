import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

// login user
router.post("/login", AuthController.loginUser);

export const authRoute = router;
