import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../shared/searchFilter";

// search filter way : 1
const getAdmins = async (params: any) => {
  const { searchTerm, ...filterData } = params;

  const filters: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];

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
  });
  return result;
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

export const adminService = {
  getAdmins,
};
