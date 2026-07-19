import { Router } from "express";
import { loginController, logoutController, refreshController, getMeController } from "./auth.controller.js";
import { verifyAdminAccessToken, verifyAdminRefreshToken } from "../../middlewares/authenticate.middleware.js";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { loginBodySchema } from "./auth.schemas.js";

const authRoutes = Router();

authRoutes.post("/login", validateSchema(loginBodySchema, "body"), loginController);
authRoutes.post("/logout", verifyAdminAccessToken, logoutController);
authRoutes.post("/refresh", verifyAdminRefreshToken, refreshController);
authRoutes.get("/me", verifyAdminAccessToken, getMeController);

export default authRoutes;
