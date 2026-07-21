import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image: z.string().optional(),
  cover_caption: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  publish_date: z.string().optional(),
  is_published: z.boolean().optional().default(true),
});

export const updatePostSchema = createPostSchema.partial();

export const postIdParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
});

export const postSlugParamsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const postQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
});

export type TCreatePost = z.infer<typeof createPostSchema>;
export type TUpdatePost = z.infer<typeof updatePostSchema>;
export type TPostIdParams = z.infer<typeof postIdParamsSchema>;
export type TPostSlugParams = z.infer<typeof postSlugParamsSchema>;
export type TPostQuery = z.infer<typeof postQuerySchema>;
