import type { Request, Response, NextFunction } from "express";
import { AppError } from "../class/appError.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import Jwt from "jsonwebtoken";

class ErrorHandler {
  public handle = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof AppError) {
      console.error(err.message);
      return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues[0]?.message });
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma validation error:", err);
      return res.status(400).json({ message: "Invalid database input" });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return res.status(409).json({ message: "Data already exists" });
        case "P2025":
          return res.status(404).json({ message: "Record not found" });
        default:
          console.error("Prisma error:", err.code, err.message);
          return res.status(400).json({ message: "Database error" });
      }
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
      console.error("DB connection error:", err);
      return res.status(503).json({ message: "Database connection failed" });
    }

    if (err instanceof Jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (err instanceof Jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }

    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  };
}

export const errorHandler = new ErrorHandler().handle;
