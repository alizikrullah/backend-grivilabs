import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { verifyAdminAccessToken } from "../../middlewares/authenticate.middleware.js";
import {
  getAllCategoriesAdminController, createCategoryController, updateCategoryController, deleteCategoryController,
  getAllFlagsAdminController, createFlagController, updateFlagController, deleteFlagController,
  getAllItemsAdminController, createItemController, updateItemController, deleteItemController,
} from "./portfolio.controller.js";
import {
  createCategorySchema, updateCategorySchema,
  createFlagSchema, updateFlagSchema,
  createItemSchema, updateItemSchema,
  idParamsSchema, adminItemQuerySchema,
} from "./portfolio.schemas.js";

const portfolioAdminRoutes = Router();
portfolioAdminRoutes.use(verifyAdminAccessToken);

// Categories
portfolioAdminRoutes.get("/categories", getAllCategoriesAdminController);
portfolioAdminRoutes.post("/categories", validateSchema(createCategorySchema, "body"), createCategoryController);
portfolioAdminRoutes.put("/categories/:id", validateSchema(idParamsSchema, "params"), validateSchema(updateCategorySchema, "body"), updateCategoryController);
portfolioAdminRoutes.delete("/categories/:id", validateSchema(idParamsSchema, "params"), deleteCategoryController);

// Flags
portfolioAdminRoutes.get("/flags", getAllFlagsAdminController);
portfolioAdminRoutes.post("/flags", validateSchema(createFlagSchema, "body"), createFlagController);
portfolioAdminRoutes.put("/flags/:id", validateSchema(idParamsSchema, "params"), validateSchema(updateFlagSchema, "body"), updateFlagController);
portfolioAdminRoutes.delete("/flags/:id", validateSchema(idParamsSchema, "params"), deleteFlagController);

// Items
portfolioAdminRoutes.get("/items", validateSchema(adminItemQuerySchema, "query"), getAllItemsAdminController);
portfolioAdminRoutes.post("/items", validateSchema(createItemSchema, "body"), createItemController);
portfolioAdminRoutes.put("/items/:id", validateSchema(idParamsSchema, "params"), validateSchema(updateItemSchema, "body"), updateItemController);
portfolioAdminRoutes.delete("/items/:id", validateSchema(idParamsSchema, "params"), deleteItemController);

export default portfolioAdminRoutes;
