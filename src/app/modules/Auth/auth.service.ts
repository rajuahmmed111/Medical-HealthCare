import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../Helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";

// login user
const loginUser = async (email: string, password: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
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
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  if (!accessToken) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Token generation failed"
    );
  }

  const refreshToken = jwtHelpers.generateToken(
    { id: userData.id, email: userData.email, role: userData.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
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
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as string
    ) as JwtPayload;
    console.log(decodedData);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your not authorized");
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const newAccessToken = jwtHelpers.generateToken(
    { id: isUserExist.id, email: isUserExist.email, role: isUserExist.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

// change password
const changePassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return user;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
