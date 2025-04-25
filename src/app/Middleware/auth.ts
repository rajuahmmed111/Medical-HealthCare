import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import ApiError from "../../Error/apiError";
import { jwtHelpers } from "../../Helpers/jwtHelpers";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Yor are not authorized");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden! You are not authorized!"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
