import jwt, { Secret, SignOptions } from "jsonwebtoken";

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


export const jwtHelpers = {
    generateToken,
}
