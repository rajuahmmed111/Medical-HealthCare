import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AuthService } from "./auth.service";

// login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Refresh token not found",
    });
  }

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged In successfully",
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  const result = await AuthService.changePassword(
    userId,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
