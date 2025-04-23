import catchAsync from "../../../Utils/catchAsync";
import sendResponse from "../../../Utils/sendResponse";
import { AuthService } from "./auth.service";

// login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
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

export const AuthController = {
  loginUser,
};
