import type { Request, Response, NextFunction } from "express";
import { loginService, refreshTokenService } from "./auth.service.js";
import type { TAdminUser } from "./auth.service.js";
import type { TLoginBody } from "./auth.schemas.js";

const IS_PROD = process.env.NODE_ENV === "production";

const ACCESS_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,
  maxAge: 15 * 60 * 1000,
};

const REFRESH_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const CLEAR_COOKIE = { httpOnly: true, secure: IS_PROD, sameSite: "strict" as const };

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokens, user } = await loginService(req.validated?.body as TLoginBody);

    res.cookie("adminAccessToken", tokens.accessToken, ACCESS_COOKIE);
    res.cookie("adminRefreshToken", tokens.refreshToken, REFRESH_COOKIE);

    return res.status(200).json({ message: "Login successful", data: user });
  } catch (error) { next(error); }
};

export const logoutController = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("adminAccessToken", CLEAR_COOKIE);
    res.clearCookie("adminRefreshToken", CLEAR_COOKIE);
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) { next(error); }
};

export const refreshController = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.admin as TAdminUser;
    const tokens = refreshTokenService(user);

    res.cookie("adminAccessToken", tokens.accessToken, ACCESS_COOKIE);
    res.cookie("adminRefreshToken", tokens.refreshToken, REFRESH_COOKIE);

    return res.status(200).json({ message: "Token refreshed", data: user });
  } catch (error) { next(error); }
};

export const getMeController = (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({ message: "OK", data: req.admin });
  } catch (error) { next(error); }
};