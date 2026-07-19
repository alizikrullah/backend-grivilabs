import { prisma } from "../../libs/prisma/prisma.lib.js";
import type { TCreateCategory, TUpdateCategory, TCreateFlag, TUpdateFlag, TCreateItem, TUpdateItem } from "./portfolio.schemas.js";

const itemInclude = {
  include: {
    flags: { include: { flag: true } },
    category: true,
  },
};

// ─── Categories ──
export const findActiveCategories = () =>
  prisma.portfolioCategory.findMany({ where: { is_active: true }, orderBy: { display_order: "asc" } });

export const findAllCategories = () =>
  prisma.portfolioCategory.findMany({ orderBy: { display_order: "asc" } });

export const findCategoryById = (id: string) =>
  prisma.portfolioCategory.findUnique({ where: { id } });

export const createCategory = (data: TCreateCategory) =>
  prisma.portfolioCategory.create({ data });

export const updateCategory = (id: string, data: TUpdateCategory) =>
  prisma.portfolioCategory.update({ where: { id }, data });

export const deleteCategory = (id: string) =>
  prisma.portfolioCategory.delete({ where: { id } });

// ─── Flags ──
export const findActiveFlags = () =>
  prisma.portfolioFlag.findMany({ where: { is_active: true }, orderBy: { display_order: "asc" } });

export const findAllFlags = () =>
  prisma.portfolioFlag.findMany({ orderBy: { display_order: "asc" } });

export const findFlagById = (id: string) =>
  prisma.portfolioFlag.findUnique({ where: { id } });

export const createFlag = (data: TCreateFlag) =>
  prisma.portfolioFlag.create({ data });

export const updateFlag = (id: string, data: TUpdateFlag) =>
  prisma.portfolioFlag.update({ where: { id }, data });

export const deleteFlag = (id: string) =>
  prisma.portfolioFlag.delete({ where: { id } });

// ─── Items ──
export const findPublishedItems = (params: {
  category?: string;
  featured?: boolean;
  skip: number;
  take: number;
}) => {
  const where = {
    is_published: true,
    ...(params.category ? { category_slug: params.category } : {}),
    ...(params.featured !== undefined ? { is_featured: params.featured } : {}),
  };
  return Promise.all([
    prisma.portfolioItem.findMany({
      where,
      ...itemInclude,
      orderBy: [{ is_featured: "desc" }, { display_order: "asc" }],
      skip: params.skip,
      take: params.take,
    }),
    prisma.portfolioItem.count({ where }),
  ]);
};

export const findPublishedItemBySlug = (slug: string) =>
  prisma.portfolioItem.findFirst({ where: { slug, is_published: true }, ...itemInclude });

export const findAllItemsAdmin = (params: {
  category?: string;
  published?: boolean;
  skip: number;
  take: number;
}) => {
  const where = {
    ...(params.category ? { category_slug: params.category } : {}),
    ...(params.published !== undefined ? { is_published: params.published } : {}),
  };
  return Promise.all([
    prisma.portfolioItem.findMany({
      where, ...itemInclude,
      orderBy: { created_at: "desc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.portfolioItem.count({ where }),
  ]);
};

export const findItemById = (id: string) =>
  prisma.portfolioItem.findUnique({ where: { id }, ...itemInclude });

export const createItem = (data: TCreateItem) => {
  const { flag_ids = [], ...itemData } = data;
  return prisma.$transaction(async (tx) => {
    const item = await tx.portfolioItem.create({ data: itemData });
    if (flag_ids.length > 0) {
      await tx.portfolioItemFlag.createMany({
        data: flag_ids.map((flag_id) => ({ item_id: item.id, flag_id })),
      });
    }
    return tx.portfolioItem.findUnique({ where: { id: item.id }, ...itemInclude });
  });
};

export const updateItem = (id: string, data: TUpdateItem) => {
  const { flag_ids, ...itemData } = data;
  return prisma.$transaction(async (tx) => {
    const item = await tx.portfolioItem.update({ where: { id }, data: itemData });
    if (flag_ids !== undefined) {
      await tx.portfolioItemFlag.deleteMany({ where: { item_id: id } });
      if (flag_ids.length > 0) {
        await tx.portfolioItemFlag.createMany({
          data: flag_ids.map((flag_id) => ({ item_id: id, flag_id })),
        });
      }
    }
    return tx.portfolioItem.findUnique({ where: { id: item.id }, ...itemInclude });
  });
};

export const deleteItem = (id: string) =>
  prisma.portfolioItem.delete({ where: { id } });
