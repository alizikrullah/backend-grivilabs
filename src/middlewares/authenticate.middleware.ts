import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config/config.js";
import { AppError } from "../class/appError.js";

type TAdminPayload = { id: string; email: string; name: string };

export const verifyAdminAccessToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.adminAccessToken;
    if (!token) throw new AppError(401, "Unauthorized");

    const payload = Jwt.verify(token, JWT_SECRET) as TAdminPayload;
    req.admin = { id: payload.id, email: payload.email, name: payload.name };
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdminRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.adminRefreshToken;
    if (!token) throw new AppError(401, "Unauthorized");

    const payload = Jwt.verify(token, REFRESH_TOKEN_SECRET) as TAdminPayload;
    req.admin = { id: payload.id, email: payload.email, name: payload.name };
    next();
  } catch (error) {
    next(error);
  }
};