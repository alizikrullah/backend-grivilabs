import { prisma } from "../../libs/prisma/prisma.lib.js";
import type { TCreateService, TUpdateService, TCreateTier } from "./services.schemas.js";

const withTiers = {
  tiers: { orderBy: { display_order: "asc" } as const },
};

export const findPublishedServices = () =>
  prisma.service.findMany({
    where: { is_published: true },
    orderBy: { display_order: "asc" },
    include: withTiers,
  });

export const findServiceBySlug = (slug: string) =>
  prisma.service.findFirst({
    where: { slug, is_published: true },
    include: withTiers,
  });

export const findAllServicesAdmin = () =>
  prisma.service.findMany({
    orderBy: { display_order: "asc" },
    include: withTiers,
  });

export const findServiceById = (id: string) =>
  prisma.service.findUnique({ where: { id }, include: withTiers });

export const findServiceBySlugAny = (slug: string) =>
  prisma.service.findUnique({ where: { slug } });

const tierRows = (tiers: TCreateTier[]) =>
  tiers.map((t, i) => ({
    name: t.name,
    badge: t.badge ?? null,
    price: t.price,
    price_note: t.price_note ?? null,
    description: t.description ?? null,
    features: t.features ?? [],
    cta: t.cta ?? null,
    is_highlighted: t.is_highlighted ?? false,
    // Urutan mengikuti posisi di array, bukan angka yang dikirim klien.
    display_order: t.display_order ?? i,
  }));

export const createService = ({ tiers = [], ...data }: TCreateService) =>
  prisma.service.create({
    data: {
      ...data,
      home_features: data.home_features ?? undefined,
      tiers: { create: tierRows(tiers) },
    },
    include: withTiers,
  });

export const updateService = (id: string, { tiers, ...data }: TUpdateService) =>
  prisma.service.update({
    where: { id },
    data: {
      ...data,
      home_features: data.home_features ?? undefined,
      updated_at: new Date(),
      // Daftar tier diganti utuh hanya kalau klien memang mengirimnya. Cek
      // `!== undefined`, BUKAN truthiness — array kosong pun truthy, jadi
      // `tiers ?` dulu keliru menganggap [] sebagai "ganti dengan kosong".
      ...(tiers !== undefined
        ? { tiers: { deleteMany: {}, create: tierRows(tiers) } }
        : {}),
    },
    include: withTiers,
  });

export const deleteService = (id: string) =>
  prisma.service.delete({ where: { id } });
