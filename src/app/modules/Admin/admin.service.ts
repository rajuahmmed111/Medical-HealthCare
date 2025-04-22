import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../shared/searchFilter";

// search filter way : 1
// const getAdmins = async (searchTerm?: any) => {
//   const filters: Prisma.AdminWhereInput[] = [];

//   const adminSearchableFields = ["name", "email"];

//   if (searchTerm) {
//     filters.push({
//       OR: adminSearchableFields.map((field) => ({
//         [field]: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }
//   const where: Prisma.AdminWhereInput = { AND: filters };

//   const result = await prisma.admin.findMany({
//     where,
//   });
//   return result;
// };

// search filter way : 2
const getAdmins = async (searchTerm?: any) => {
  const adminSearchableFields = ["name", "email"];

  const where: Prisma.AdminWhereInput | undefined = searchFilter(
    searchTerm,
    adminSearchableFields
  );
  const result = await prisma.admin.findMany({
    where,
  });

  return result;
};

export const adminService = {
  getAdmins,
};
