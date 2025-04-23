import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelpers } from "../../../Helpers/generateToken";

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

  const accessToken = jwtHelpers.generateToken(
    { id: userData.id, email: userData.email, role: userData.role },
    "abcdefg",
    "5m"
  );
  if (!accessToken) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Token generation failed"
    );
  }

  const refreshToken = jwtHelpers.generateToken(
    { id: userData.id, email: userData.email, role: userData.role },
    "abcdefghijklmnop",
    "5m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwt.verify(token, "abcdefghijklmnop");
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
    },
  });
  if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

    const newAccessToken = jwtHelpers.generateToken(
        { id: isUserExist.id, email: isUserExist.email, role: isUserExist.role },
        "abcdefg",
        "5m"
    );

  return {
    accessToken: newAccessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
