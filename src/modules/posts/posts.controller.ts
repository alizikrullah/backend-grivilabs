import type { Request, Response, NextFunction } from "express";
import {
  getPublishedPostsService, getPostBySlugService,
  getAllPostsAdminService,
  createPostService, updatePostService, deletePostService,
} from "./posts.service.js";
import type { TCreatePost, TUpdatePost, TPostIdParams, TPostSlugParams, TPostQuery } from "./posts.schemas.js";

export const getPublishedPostsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPublishedPostsService(req.validated?.query as TPostQuery);
    return res.status(200).json({ message: "OK", ...result });
  } catch (error) { next(error); }
};

export const getPostBySlugController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getPostBySlugService((req.validated?.params as TPostSlugParams).slug);
    return res.status(200).json({ message: "OK", data });
  } catch (error) { next(error); }
};

export const getAllPostsAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllPostsAdminService(req.validated?.query as TPostQuery);
    return res.status(200).json({ message: "OK", ...result });
  } catch (error) { next(error); }
};

export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await createPostService(req.validated?.body as TCreatePost);
    return res.status(201).json({ message: "Post created", data });
  } catch (error) { next(error); }
};

export const updatePostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updatePostService(
      (req.validated?.params as TPostIdParams).id,
      req.validated?.body as TUpdatePost
    );
    return res.status(200).json({ message: "Post updated", data });
  } catch (error) { next(error); }
};

export const deletePostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePostService((req.validated?.params as TPostIdParams).id);
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) { next(error); }
};
