import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import {
  getActiveCategoriesController, getActiveFlagsController,
  getPublishedItemsController, getPublishedItemBySlugController,
} from "./portfolio.controller.js";
import { itemQuerySchema, itemSlugParamsSchema } from "./portfolio.schemas.js";

const portfolioPublicRoutes = Router();

portfolioPublicRoutes.get("/categories", getActiveCategoriesController);
portfolioPublicRoutes.get("/flags", getActiveFlagsController);
portfolioPublicRoutes.get("/items", validateSchema(itemQuerySchema, "query"), getPublishedItemsController);
portfolioPublicRoutes.get("/items/:slug", validateSchema(itemSlugParamsSchema, "params"), getPublishedItemBySlugController);

export default portfolioPublicRoutes;
