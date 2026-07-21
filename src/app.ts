import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { FRONTEND_URL, NODE_ENV, PORT } from "./config/config.js";
import { AppError } from "./class/appError.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import postsPublicRoutes from "./modules/posts/posts.routes.js";
import postsAdminRoutes from "./modules/posts/posts.admin.routes.js";
import portfolioPublicRoutes from "./modules/portfolio/portfolio.routes.js";
import portfolioAdminRoutes from "./modules/portfolio/portfolio.admin.routes.js";
import leadsPublicRoutes from "./modules/leads/leads.routes.js";
import leadsAdminRoutes from "./modules/leads/leads.admin.routes.js";
import servicesPublicRoutes from "./modules/services/services.routes.js";
import servicesAdminRoutes from "./modules/services/services.admin.routes.js";

const app = express();

// Support multiple origins dipisah koma di env:
// FRONTEND_URL=http://localhost:5173,https://grivilabs.vercel.app
const allowedOrigins = FRONTEND_URL.split(",").map((o) => o.trim());

app.disable("x-powered-by");
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} tidak diizinkan`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(express.json());

if (NODE_ENV === "development") {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "GriviLabs API", version: "1.0.0", port: PORT });
});

// Public
app.use("/api/posts", postsPublicRoutes);
app.use("/api/portfolio", portfolioPublicRoutes);
app.use("/api/leads", leadsPublicRoutes);
app.use("/api/services", servicesPublicRoutes);

// Admin
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/admin/posts", postsAdminRoutes);
app.use("/api/admin/portfolio", portfolioAdminRoutes);
app.use("/api/admin/leads", leadsAdminRoutes);
app.use("/api/admin/services", servicesAdminRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

export default app;