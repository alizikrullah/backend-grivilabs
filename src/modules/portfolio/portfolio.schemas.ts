import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

// ─── Categories ──
export const createCategorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  display_order: z.number().int().optional().default(0),
  is_active: z.boolean().optional().default(true),
});
export const updateCategorySchema = createCategorySchema.partial();

// ─── Flags ──
export const createFlagSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  label: z.string().min(1, "Label is required"),
  color_bg: z.string().min(1, "Background color is required"),
  color_text: z.string().min(1, "Text color is required"),
  icon: z.string().optional(),
  display_order: z.number().int().optional().default(0),
  is_active: z.boolean().optional().default(true),
  flag_category: z.string().optional().default("status"),
});
export const updateFlagSchema = createFlagSchema.partial();

// ─── Items ──
export const createItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category_slug: z.string().min(1, "Category is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail_url: z.string().optional(),
  live_url: z.string().optional(),
  demo_url: z.string().optional(),
  is_published: z.boolean().optional().default(true),
  is_placeholder: z.boolean().optional().default(false),
  is_real: z.boolean().optional().default(true),
  is_confidential: z.boolean().optional().default(false),
  confidential_level: z.enum(["high", "standard"]).optional(),
  modal_lines: z.array(z.string()).optional().default([]),
  is_featured: z.boolean().optional().default(false),
  display_order: z.number().int().optional().default(0),
  flag_ids: z.array(z.string().uuid()).optional().default([]),
});
export const updateItemSchema = createItemSchema.partial();

export const itemSlugParamsSchema = z.object({
  slug: z.string().min(1),
});

export const itemQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const adminItemQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  category: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export type TCreateCategory = z.infer<typeof createCategorySchema>;
export type TUpdateCategory = z.infer<typeof updateCategorySchema>;
export type TCreateFlag = z.infer<typeof createFlagSchema>;
export type TUpdateFlag = z.infer<typeof updateFlagSchema>;
export type TCreateItem = z.infer<typeof createItemSchema>;
export type TUpdateItem = z.infer<typeof updateItemSchema>;
export type TIdParams = z.infer<typeof idParamsSchema>;
export type TItemSlugParams = z.infer<typeof itemSlugParamsSchema>;
export type TItemQuery = z.infer<typeof itemQuerySchema>;
export type TAdminItemQuery = z.infer<typeof adminItemQuerySchema>;
