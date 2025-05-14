import express from 'express';
import { PatientController } from './patient.controller';

const router = express.Router();

// get all
router.get(
    '/',
    PatientController.getAllFromDB
);


// get single
router.get(
    '/:id',
    PatientController.getByIdFromDB
);

// update patient
router.patch(
    '/:id',
    PatientController.updateIntoDB
);

// delete patient
router.delete(
    '/:id',
    PatientController.deleteFromDB
);

// soft delete
router.delete(
    '/soft/:id',
    PatientController.softDelete
);

export const patientRoutes = router;