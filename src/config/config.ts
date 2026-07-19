import dotenv from "dotenv";
import { getRequiredEnv, getNumberEnv } from "./config.helper.js";
dotenv.config();

export const PORT = getNumberEnv("PORT", 8000);
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const DATABASE_URL = getRequiredEnv("DATABASE_URL");
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
export const JWT_SECRET = getRequiredEnv("JWT_SECRET");
export const REFRESH_TOKEN_SECRET = getRequiredEnv("REFRESH_TOKEN_SECRET");
export const DIRECTUS_URL = getRequiredEnv("DIRECTUS_URL");