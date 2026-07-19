import { AppError } from "../../class/appError.js";
import {
  findAllPublishedPosts, findPublishedPostBySlug,
  findAllPostsAdmin, findPostById,
  createPost, updatePost, deletePost,
} from "./posts.repository.js";
import type { TCreatePost, TUpdatePost, TPostQuery } from "./posts.schemas.js";

const buildMeta = (page: number, limit: number, total: number) => ({
  page, limit, total, totalPages: Math.ceil(total / limit),
});

export const getPublishedPostsService = async (query: TPostQuery) => {
  const [posts, total] = await findAllPublishedPosts(query.page, query.limit);
  return { data: posts, meta: buildMeta(query.page, query.limit, total) };
};

export const getPostBySlugService = async (slug: string) => {
  const post = await findPublishedPostBySlug(slug);
  if (!post) throw new AppError(404, "Post not found");
  return post;
};

export const getAllPostsAdminService = async (query: TPostQuery) => {
  const [posts, total] = await findAllPostsAdmin(query.page, query.limit);
  return { data: posts, meta: buildMeta(query.page, query.limit, total) };
};

export const createPostService = (data: TCreatePost) => createPost(data);

export const updatePostService = async (id: string, data: TUpdatePost) => {
  const post = await findPostById(id);
  if (!post) throw new AppError(404, "Post not found");
  return updatePost(id, data);
};

export const deletePostService = async (id: string) => {
  const post = await findPostById(id);
  if (!post) throw new AppError(404, "Post not found");
  return deletePost(id);
};
