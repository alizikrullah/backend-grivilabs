import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { submitLeadController } from "./leads.controller.js";
import { createLeadSchema } from "./leads.schemas.js";

const leadsPublicRoutes = Router();

leadsPublicRoutes.post("/", validateSchema(createLeadSchema, "body"), submitLeadController);

export default leadsPublicRoutes;
