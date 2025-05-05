import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../Helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import emailSender from "../../../Helpers/emailSender";

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
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const isPasswordMatch: boolean = await bcrypt.compare(
    oldPassword,
    userData.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

// forgot password
const forgotPassword = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const resetPssToken = jwtHelpers.generateToken(
    { id: userData.id, email: userData.email, role: userData.role },
    config.jwt.rest_password_secret as Secret,
    config.jwt.rest_password_expires_in as string
  );

  const resetPassLink =
    config.reset_password_link +
    `?userId=${userData.id}&token=${resetPssToken}`;

  await emailSender(
    "Reset Your Password",
    userData.email,
    `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; line-height: 1.6; color: #333333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #FF7600; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
          </div>
          <div style="padding: 40px 30px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>
  
              <p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password. Click the button below to reset your password:</p>
  
              <div style="text-align: center; margin-bottom: 30px;">
                  <a href=${resetPassLink} style="display: inline-block; background-color: #FF7600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease;">
                      Reset Password
                  </a>
              </div>
  
              <p style="font-size: 16px; margin-bottom: 20px;">If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
  
              <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br>Your Support Team</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d;">
              <p style="margin: 0 0 10px;">This is an automated message, please do not reply to this email.</p>
              <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`
  );
  return {
    message: "Reset password link sent via your email successfully",
    resetPassLink,
  };
};

// reset password
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.rest_password_secret as string
  );
  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // update user
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
      // needPasswordChange: false
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
