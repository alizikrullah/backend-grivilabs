import { prisma } from "../../libs/prisma/prisma.lib.js";
import type { TCreatePost, TUpdatePost } from "./posts.schemas.js";

export const findAllPublishedPosts = (page: number, limit: number) =>
  Promise.all([
    prisma.post.findMany({
      where: { is_published: true },
      orderBy: { publish_date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where: { is_published: true } }),
  ]);

export const findPublishedPostBySlug = (slug: string) =>
  prisma.post.findFirst({ where: { slug, is_published: true } });

export const findAllPostsAdmin = (page: number, limit: number) =>
  Promise.all([
    prisma.post.findMany({
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count(),
  ]);

export const findPostById = (id: string) =>
  prisma.post.findUnique({ where: { id } });

export const createPost = (data: TCreatePost) =>
  prisma.post.create({ data });

export const updatePost = (id: string, data: TUpdatePost) =>
  prisma.post.update({ where: { id }, data });

export const deletePost = (id: string) =>
  prisma.post.delete({ where: { id } });
