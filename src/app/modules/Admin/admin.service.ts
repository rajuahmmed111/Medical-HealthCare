import httpStatus from "http-status";
import { Admin, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../Helpers/searchFilter";
import { adminSearchableFields } from "./admin.constant";
import { calculatedPagination } from "../../../Helpers/calculatePagination";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../../Interface/common";
import ApiError from "../../../Error/apiError";

// search filter way : 1
const getAdmins = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    calculatedPagination(options);

  const { searchTerm, ...filterData } = params;

  const filters: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    filters.push({
      OR: adminSearchableFields.map((field) => ({
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

  const where: Prisma.AdminWhereInput = { AND: filters };

  const result = await prisma.admin.findMany({
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

  const total = await prisma.admin.count({ where });

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
const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// update admin by id
const updateAdminByIdIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!existingAdmin) {
    throw new Error("Admin not found");
  }

  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });

  return result;
};

// delete admin by id
const deleteAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existingAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.delete({ where: { id } });
    if (!deletedAdmin) {
      throw new Error("Admin not found");
    }

    await tx.user.delete({
      where: { email: deletedAdmin?.email },
    });
    return deletedAdmin;
  });

  return result;
};

// soft delete admin by id
const softDeleteAdminByIdFromDB = async (id: string): Promise<Admin | void> => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existingAdmin) {
    throw new Error("Admin not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.findUnique({ where: { id } });
    if (!deletedAdmin) {
      throw new Error("Admin not found");
    }

    const updateAdmin = await tx.admin.update({
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

export const AdminService = {
  getAdmins,
  getAdminByIdFromDB,
  updateAdminByIdIntoDB,
  deleteAdminByIdFromDB,
  softDeleteAdminByIdFromDB,
};
