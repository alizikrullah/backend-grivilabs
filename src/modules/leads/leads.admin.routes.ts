import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { verifyAdminAccessToken } from "../../middlewares/authenticate.middleware.js";
import { getLeadsController, updateLeadStatusController } from "./leads.controller.js";
import { leadQuerySchema, leadIdParamsSchema, updateLeadStatusSchema } from "./leads.schemas.js";

const leadsAdminRoutes = Router();
leadsAdminRoutes.use(verifyAdminAccessToken);

leadsAdminRoutes.get("/", validateSchema(leadQuerySchema, "query"), getLeadsController);
leadsAdminRoutes.patch("/:id/status",
  validateSchema(leadIdParamsSchema, "params"),
  validateSchema(updateLeadStatusSchema, "body"),
  updateLeadStatusController
);

export default leadsAdminRoutes;
