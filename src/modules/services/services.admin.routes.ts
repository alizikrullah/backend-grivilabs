import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { verifyAdminAccessToken } from "../../middlewares/authenticate.middleware.js";
import {
  getAllServicesAdminController, getServiceByIdController,
  createServiceController, updateServiceController, deleteServiceController,
} from "./services.controller.js";
import {
  createServiceSchema, updateServiceSchema, serviceIdParamsSchema,
} from "./services.schemas.js";

const servicesAdminRoutes = Router();
servicesAdminRoutes.use(verifyAdminAccessToken);

servicesAdminRoutes.get("/", getAllServicesAdminController);
servicesAdminRoutes.get("/:id", validateSchema(serviceIdParamsSchema, "params"), getServiceByIdController);
servicesAdminRoutes.post("/", validateSchema(createServiceSchema, "body"), createServiceController);
servicesAdminRoutes.put("/:id",
  validateSchema(serviceIdParamsSchema, "params"),
  validateSchema(updateServiceSchema, "body"),
  updateServiceController
);
servicesAdminRoutes.delete("/:id", validateSchema(serviceIdParamsSchema, "params"), deleteServiceController);

export default servicesAdminRoutes;
