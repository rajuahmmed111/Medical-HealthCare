import httpStatus from "http-status";
import { Admin, Doctor, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { calculatedPagination } from "../../../Helpers/calculatePagination";
import { IPaginationOptions } from "../../../Interface/common";
import { IDoctorFilterRequest } from "./doctor.interface";
import { doctorSearchableFields } from "./doctor.constant";
import ApiError from "../../../Error/apiError";

// search filter way : 1
const getDoctors = async (
  params: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    calculatedPagination(options);

  const { searchTerm, ...filterData } = params;

  const filters: Prisma.DoctorWhereInput[] = [];

  if (params?.searchTerm) {
    filters.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Exact search filter
  if (Object.keys(filterData).length > 0) {
    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  filters.push({
    isDeleted: false,
  });

  const where: Prisma.DoctorWhereInput = { AND: filters };

  const result = await prisma.doctor.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.doctor.count({ where });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// search filter way : 2
// const getAdmins = async (searchTerm?: any) => {
//   const adminSearchableFields = ["name", "email"];

//   const where: Prisma.AdminWhereInput | undefined = searchFilter(
//     searchTerm,
//     adminSearchableFields
//   );
//   const result = await prisma.admin.findMany({
//     where,
//   });

//   return result;
// };

// gets a single admin by id
const getDoctorByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  return result;
};

// update doctor by id
const updateDoctorByIdIntoDB = async (
  id: string,
  payload: any
): Promise<Doctor | null> => {
  const { specialties, ...doctorData } = payload;
  console.log(specialties, "specialties");
  console.log(doctorData, "doctorData");

  const existingDoctor = await prisma.doctor.findUnique({
    where: { id },
  });
  if (!existingDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  // update doctor and create doctor specialties in one transaction
  const result = await prisma.$transaction(async (tx) => {
    const updatedDoctor = await tx.doctor.update({
      where: {
        id,
        isDeleted: false,
      },
      data: doctorData,
    });

    for (const specialtiesId of specialties) {
      await tx.doctorSpecialties.create({
        data: {
          doctorId: existingDoctor.id,
          specialtiesId: specialtiesId,
        },
      });
    }

    return updatedDoctor;
  });

  return result;
};

// delete doctor by id
const deleteDoctorByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existingDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedDoctor = await tx.doctor.delete({ where: { id } });
    if (!deletedDoctor) {
      throw new Error("Admin not found");
    }

    await tx.user.delete({
      where: { email: deletedDoctor?.email },
    });
    return deletedDoctor;
  });

  return result;
};

// soft delete doctor by id
const softDeleteDoctorByIdFromDB = async (
  id: string
): Promise<Doctor | void> => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existingDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedDoctor = await tx.doctor.findUnique({ where: { id } });
    if (!deletedDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
    }

    const updateAdmin = await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    const updateStatusUser = await tx.user.update({
      where: { email: updateAdmin?.email },
      data: {
        status: UserStatus.DELETED,
      },
    });

    const { password, ...sanitizedData } = updateStatusUser;
    return sanitizedData;
  });

  // return result;
};

export const DoctorService = {
  getDoctors,
  getDoctorByIdFromDB,
  updateDoctorByIdIntoDB,
  deleteDoctorByIdFromDB,
  softDeleteDoctorByIdFromDB,
};
