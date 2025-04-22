import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";

// search filter way : 1
// const getAdmins = async (searchTerm: any) => {
//   const andCondition: Prisma.AdminWhereInput[] = [];

//   if (searchTerm) {
//     andCondition.push({
//       OR: [
//         {
//           name: {
//             contains: searchTerm,
//             mode: "insensitive",
//           },
//         },
//         {
//           email: {
//             contains: searchTerm,
//             mode: "insensitive",
//           },
//         },
//       ],
//     });
//   }
//   const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

//   const result = await prisma.admin.findMany({
//     where: whereCondition,
//   });
//   return result;
// };

// search filter way : 2
const getAdmins = async (searchTerm?: any) => {
  const where: Prisma.AdminWhereInput | undefined = searchTerm
    ? {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      }
    : undefined;

  const result = await prisma.admin.findMany({
    where,
  });

  return result;
};

export const adminService = {
  getAdmins,
};
