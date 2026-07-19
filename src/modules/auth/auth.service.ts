import Jwt from "jsonwebtoken";
import { AppError } from "../../class/appError.js";
import { DIRECTUS_URL, JWT_SECRET, REFRESH_TOKEN_SECRET } from "../../config/config.js";
import type { TLoginBody } from "./auth.schemas.js";

export type TAdminUser = { id: string; email: string; name: string };
type TTokenPair = { accessToken: string; refreshToken: string };

const buildTokens = (user: TAdminUser): TTokenPair => ({
  accessToken: Jwt.sign(user, JWT_SECRET, { expiresIn: "15m" }),
  refreshToken: Jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }),
});

export const loginService = async (body: TLoginBody) => {
  // 1. Login ke Directus
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  if (!loginRes.ok) {
    throw new AppError(401, "Email or password is incorrect");
  }

  const { data: loginData } = (await loginRes.json()) as {
    data: { access_token: string };
  };

  // 2. Decode Directus JWT payload — admin_access sudah ada di sini
  // Pakai Jwt.decode (tanpa verify) karena kita ga punya secret Directus,
  // tapi token ini langsung dari Directus API jadi bisa dipercaya
  const directusPayload = Jwt.decode(loginData.access_token) as {
    admin_access?: boolean;
  } | null;

  if (!directusPayload?.admin_access) {
    throw new AppError(403, "Access denied: Administrator only");
  }

  // 3. Ambil user info untuk JWT kita sendiri
  const meRes = await fetch(
    `${DIRECTUS_URL}/users/me?fields=id,email,first_name,last_name`,
    { headers: { Authorization: `Bearer ${loginData.access_token}` } }
  );

  if (!meRes.ok) {
    throw new AppError(401, "Failed to get user info");
  }

  const { data: me } = (await meRes.json()) as {
    data: {
      id: string;
      email: string;
      first_name: string | null;
      last_name: string | null;
    };
  };

  const user: TAdminUser = {
    id: me.id,
    email: me.email,
    name: [me.first_name, me.last_name].filter(Boolean).join(" "),
  };

  return { tokens: buildTokens(user), user };
};

export const refreshTokenService = (user: TAdminUser): TTokenPair =>
  buildTokens(user);