import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const isPasswordMatch: boolean = await bcrypt.compare(
    password,
    userData.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email, role: userData.role },
    "abcdefg",
    { algorithm: "HS256", expiresIn: "1h" }
  );
  if (!accessToken) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Token generation failed"
    );
  }

  
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    }
};

export const AuthService = {
  loginUser,
};
