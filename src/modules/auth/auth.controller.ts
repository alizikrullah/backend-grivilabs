import type { Request, Response, NextFunction } from "express";
import { loginService, refreshTokenService } from "./auth.service.js";
import type { TAdminUser } from "./auth.service.js";
import type { TLoginBody } from "./auth.schemas.js";

const IS_PROD = process.env.NODE_ENV === "production";

// sameSite "none" diperlukan untuk cross-site requests (frontend .vercel.app ke backend .my.id)
// sameSite "none" wajib pasang dengan secure: true (hanya boleh di HTTPS/production)
// Di dev: pakai "lax" supaya bisa jalan di localhost tanpa HTTPS
const SAME_SITE = IS_PROD ? ("none" as const) : ("lax" as const);

const ACCESS_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: SAME_SITE,
  maxAge: 15 * 60 * 1000, // 15 menit
};

const REFRESH_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: SAME_SITE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
};

const CLEAR_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: SAME_SITE,
};

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