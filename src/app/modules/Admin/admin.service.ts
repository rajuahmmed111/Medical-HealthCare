import prisma from "../../../shared/prisma";

// get admins
const getAdmins = async (searchTerm: any) => {
  const result = await prisma.admin.findMany({
    where: {
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
    },
  });
  return result;
};

export const adminService = {
  getAdmins,
};
