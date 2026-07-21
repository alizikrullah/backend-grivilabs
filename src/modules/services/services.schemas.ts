import { z } from "zod";

const featureList = z.array(z.string()).optional().nullable();

export const createTierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  badge: z.string().optional().nullable(),
  price: z.string().min(1, "Price is required"),
  price_note: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  features: featureList,
  cta: z.string().optional().nullable(),
  is_highlighted: z.boolean().optional().default(false),
  display_order: z.number().int().optional().default(0),
});

export const createServiceSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  label: z.string().min(1, "Label is required"),
  short_label: z.string().min(1, "Short label is required"),
  icon: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  is_single: z.boolean().optional().default(false),
  display_order: z.number().int().optional().default(0),
  is_published: z.boolean().optional().default(true),

  show_on_home: z.boolean().optional().default(false),
  home_order: z.number().int().optional().default(0),
  home_subtitle: z.string().optional().nullable(),
  home_description: z.string().optional().nullable(),
  home_duration: z.string().optional().nullable(),
  home_icon: z.string().optional().nullable(),
  home_features: featureList,
  home_featured: z.boolean().optional().default(false),
  home_price_override: z.string().optional().nullable(),

  // Tier dikirim menyatu dengan paketnya. Menyimpan paket berarti mengganti
  // seluruh daftar tier-nya — lebih sederhana dan tidak meninggalkan tier yatim
  // dibanding mengelola tambah/ubah/hapus satu per satu dari sisi frontend.
  tiers: z.array(createTierSchema).optional().default([]),
});

export const updateServiceSchema = createServiceSchema.partial();

export const serviceIdParamsSchema = z.object({
  id: z.string().uuid("Invalid service ID"),
});

export const serviceSlugParamsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export type TCreateService = z.infer<typeof createServiceSchema>;
export type TUpdateService = z.infer<typeof updateServiceSchema>;
export type TCreateTier = z.infer<typeof createTierSchema>;
export type TServiceIdParams = z.infer<typeof serviceIdParamsSchema>;
export type TServiceSlugParams = z.infer<typeof serviceSlugParamsSchema>;
