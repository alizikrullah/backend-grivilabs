import { Router } from "express";
import { validateSchema } from "../../middlewares/zodValidator.middleware.js";
import { verifyAdminAccessToken } from "../../middlewares/authenticate.middleware.js";
import {
  getAllPostsAdminController, createPostController,
  updatePostController, deletePostController,
} from "./posts.controller.js";
import { createPostSchema, updatePostSchema, postIdParamsSchema, postQuerySchema } from "./posts.schemas.js";

const postsAdminRoutes = Router();
postsAdminRoutes.use(verifyAdminAccessToken);

postsAdminRoutes.get("/", validateSchema(postQuerySchema, "query"), getAllPostsAdminController);
postsAdminRoutes.post("/", validateSchema(createPostSchema, "body"), createPostController);
postsAdminRoutes.put("/:id",
  validateSchema(postIdParamsSchema, "params"),
  validateSchema(updatePostSchema, "body"),
  updatePostController
);
postsAdminRoutes.delete("/:id", validateSchema(postIdParamsSchema, "params"), deletePostController);

export default postsAdminRoutes;
