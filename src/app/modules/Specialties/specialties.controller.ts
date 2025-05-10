import { Request, Response } from "express";
import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.createSpecialties(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties created successfully",
    data: result,
  });
});

export const SpecialtiesController = { createSpecialties };
