import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { getPublishedPostsController, getPostBySlugController } from "./posts.controller.js";
import { postQuerySchema, postSlugParamsSchema } from "./posts.schemas.js";

const postsPublicRoutes = Router();

postsPublicRoutes.get("/", validateSchema(postQuerySchema, "query"), getPublishedPostsController);
postsPublicRoutes.get("/:slug", validateSchema(postSlugParamsSchema, "params"), getPostBySlugController);

export default postsPublicRoutes;
