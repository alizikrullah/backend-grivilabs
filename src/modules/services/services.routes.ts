import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { getPublishedServicesController, getServiceBySlugController } from "./services.controller.js";
import { serviceSlugParamsSchema } from "./services.schemas.js";

const servicesPublicRoutes = Router();

servicesPublicRoutes.get("/", getPublishedServicesController);
servicesPublicRoutes.get("/:slug", validateSchema(serviceSlugParamsSchema, "params"), getServiceBySlugController);

export default servicesPublicRoutes;
