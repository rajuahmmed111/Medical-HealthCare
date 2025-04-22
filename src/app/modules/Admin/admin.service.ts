import { Admin, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../Helpers/searchFilter";
import { adminSearchableFields } from "./admin.constant";
import { calculatedPagination } from "../../../Helpers/calculatePagination";

// search filter way : 1
const getAdmins = async (params: any, options: any) => {
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
          equals: filterData[key],
        },
      })),
    });
  }

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
const getAdminByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update admin by id
const updateAdminByIdIntoDB = async (id: string, data: Partial<Admin>) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!existingAdmin) {
    throw new Error("Admin not found");
  }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

export const adminService = {
  getAdmins,
  getAdminByIdFromDB,
  updateAdminByIdIntoDB,
};
