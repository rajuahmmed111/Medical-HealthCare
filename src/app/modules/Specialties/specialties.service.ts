import { Specialties } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { IUploadedFile } from "../../../Interface/file";
import { uploadFile } from "../../../Helpers/fileUpload";

// create specialties
const createSpecialties = async (req: Request): Promise<Specialties> => {
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

// get all Specialties
const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

// delete Specialties
const deleteFromDB = async (id: string): Promise<Specialties> => {
  const isExisting = await prisma.specialties.findUnique({
    where: {
      id,
    },
  });
  if (!isExisting) {
    throw new Error("Specialties not found");
  }

  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialties,
  getAllFromDB,
  deleteFromDB,
};
