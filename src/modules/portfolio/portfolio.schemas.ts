import { z } from "zod";

// PENTING: schema *create* di file ini TIDAK boleh pakai .default(). Setiap
// update-nya dibuat lewat .partial(), dan Zod tetap menjalankan .default() pada
// partial — jadi PUT parsial (mis. toggle publish yang cuma kirim is_published)
// akan menyuntikkan SEMUA default. Untuk item, itu ikut menulis modal_lines:[]
// (menghapus konten modal) dan flag_ids:[] (mencabut semua flag). Nilai default
// untuk data baru sudah ditangani schema Prisma (@default pada tiap kolom).
// Catatan: schema *query* di bawah tetap boleh .default() — tidak di-partial().

export const idParamsSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

// ─── Categories ──
export const createCategorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

// ─── Flags ──
export const createFlagSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  label: z.string().min(1, "Label is required"),
  color_bg: z.string().min(1, "Background color is required"),
  color_text: z.string().min(1, "Text color is required"),
  icon: z.string().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  flag_category: z.string().optional(),
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
  is_published: z.boolean().optional(),
  is_placeholder: z.boolean().optional(),
  is_real: z.boolean().optional(),
  is_confidential: z.boolean().optional(),
  confidential_level: z.enum(["high", "standard"]).optional(),
  modal_lines: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  display_order: z.number().int().optional(),
  flag_ids: z.array(z.string().uuid()).optional(),
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
