import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";

// login user
const loginUser = async (email: string, password: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatch: boolean = await bcrypt.compare(password, userData.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }
};

export const AuthService = {
  loginUser,
};
