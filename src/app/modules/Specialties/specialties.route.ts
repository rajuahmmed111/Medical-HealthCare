import express from "express";
import { SpecialtiesController } from "./specialties.controller";
import validateRequest from "../../Middleware/validateRequest";
import { SpecialtiesValidation } from "./specialties.validation";


const router = express.Router();

// create specialties
router.post(
    "/",
    SpecialtiesController.createSpecialties,
    validateRequest(SpecialtiesValidation.createSpecialties)
);


export const specialtiesRoute = router;
