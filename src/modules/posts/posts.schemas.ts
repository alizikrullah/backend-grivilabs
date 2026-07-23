import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  // .nullish() = string | null | undefined. Form Create/Edit blog mengirim
  // `cover_image || null`, `cover_caption || null`, `tags || null` saat field
  // dikosongkan; semua kolom ini String? di DB, jadi menulis null memang cara
  // mengosongkannya. .optional() saja menolak null → PUT/POST 400
  // "expected string, received null". Sisanya dibuat nullish juga agar konsisten.
  excerpt: z.string().nullish(),
  content: z.string().nullish(),
  cover_image: z.string().nullish(),
  cover_caption: z.string().nullish(),
  author: z.string().nullish(),
  tags: z.string().nullish(),
  publish_date: z.string().optional(),
  // Tanpa .default(true): updatePostSchema = .partial(), dan Zod tetap
  // menjalankan default pada partial — sehingga mengedit artikel tanpa
  // mengirim is_published akan diam-diam menerbitkan ulang draft. Nilai
  // default untuk post baru ditangani schema Prisma (is_published @default(true)).
  is_published: z.boolean().optional(),
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
