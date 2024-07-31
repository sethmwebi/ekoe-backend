import { Role } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import validEnv from "./validEnv";

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

const generateToken = (res: Response, user: UserPayload) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, validEnv.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: validEnv.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { token };
};

export default generateToken;
