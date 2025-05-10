import { Specialties } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ISpecialties } from "./specialties.interface";

const createSpecialties = async (payload: ISpecialties): Promise<Specialties> => {
  const result = await prisma.specialties.create({
    data: payload,
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialties,
};
