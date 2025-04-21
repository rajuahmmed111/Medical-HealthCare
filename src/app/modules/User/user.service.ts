import { UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };

  // use transaction to create user and admin data
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const admin = await tx.admin.create({
      data: data.admin,
    });

    return admin;
  });

  return result;
};

export const userService = {
  createAdmin,
};
