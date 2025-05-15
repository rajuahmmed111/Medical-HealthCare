import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../../Utils/catchAsync';
import { pick } from '../../../shared/pick';
import { filterableFields } from './patient.constant';
import { paginationField } from '../../../Interface/common';
import sendResponse from '../../../Utils/sendResponse';
import { PatientService } from './patient.service';


// get all patients
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, filterableFields);
  const options = pick(req.query, paginationField);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});


// get patient by id
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient retrieval successfully',
    data: result,
  });
});


// update patient
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient updated successfully',
    data: result,
  });
});


// delete patient
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient deleted successfully',
    data: result,
  });
});

// soft delete
const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient soft deleted successfully',
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};