import httpStatus from "http-status";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import ApiError from "../Error/apiError";

type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

const generateToken = (
  payload: TokenPayload,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
