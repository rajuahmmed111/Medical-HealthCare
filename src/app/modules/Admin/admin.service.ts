import prisma from "../../../shared/prisma";

// get admins
const getAdmins = async (searchTerm: any) => {
  const result = await prisma.admin.findMany({
    where: {
      name: {
        contains: searchTerm || undefined,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const adminService = {
  getAdmins,
};
