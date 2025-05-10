import { Specialties } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { IUploadedFile } from "../../../Interface/file";
import { uploadFile } from "../../../Helpers/fileUpload";

const createSpecialties = async (req: Request) => {
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadToCloudinary = await uploadFile.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialties,
};
