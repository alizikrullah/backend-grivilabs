import { AppError } from "../../class/appError.js";
import {
  findActiveCategories, findAllCategories, findCategoryById,
  createCategory, updateCategory, deleteCategory,
  findActiveFlags, findAllFlags, findFlagById,
  createFlag, updateFlag, deleteFlag,
  findPublishedItems, findPublishedItemBySlug,
  findAllItemsAdmin, findItemById,
  createItem, updateItem, deleteItem,
} from "./portfolio.repository.js";
import type {
  TCreateCategory, TUpdateCategory,
  TCreateFlag, TUpdateFlag,
  TCreateItem, TUpdateItem,
  TItemQuery, TAdminItemQuery,
} from "./portfolio.schemas.js";

const buildMeta = (page: number, limit: number, total: number) => ({
  page, limit, total, totalPages: Math.ceil(total / limit),
});

// ─── Categories ──
export const getActiveCategoriesService = () => findActiveCategories();
export const getAllCategoriesAdminService = () => findAllCategories();
export const createCategoryService = (data: TCreateCategory) => createCategory(data);

export const updateCategoryService = async (id: string, data: TUpdateCategory) => {
  const cat = await findCategoryById(id);
  if (!cat) throw new AppError(404, "Category not found");
  return updateCategory(id, data);
};

export const deleteCategoryService = async (id: string) => {
  const cat = await findCategoryById(id);
  if (!cat) throw new AppError(404, "Category not found");
  return deleteCategory(id);
};

// ─── Flags ──
export const getActiveFlagsService = () => findActiveFlags();
export const getAllFlagsAdminService = () => findAllFlags();
export const createFlagService = (data: TCreateFlag) => createFlag(data);

export const updateFlagService = async (id: string, data: TUpdateFlag) => {
  const flag = await findFlagById(id);
  if (!flag) throw new AppError(404, "Flag not found");
  return updateFlag(id, data);
};

export const deleteFlagService = async (id: string) => {
  const flag = await findFlagById(id);
  if (!flag) throw new AppError(404, "Flag not found");
  return deleteFlag(id);
};

// ─── Items ──
export const getPublishedItemsService = async (query: TItemQuery) => {
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await findPublishedItems({ category: query.category, featured: query.featured, skip, take: query.limit });
  return { data: items, meta: buildMeta(query.page, query.limit, total) };
};

export const getPublishedItemBySlugService = async (slug: string) => {
  const item = await findPublishedItemBySlug(slug);
  if (!item) throw new AppError(404, "Portfolio item not found");
  return item;
};

export const getAllItemsAdminService = async (query: TAdminItemQuery) => {
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await findAllItemsAdmin({ category: query.category, published: query.published, skip, take: query.limit });
  return { data: items, meta: buildMeta(query.page, query.limit, total) };
};

export const getItemByIdService = async (id: string) => {
  const item = await findItemById(id);
  if (!item) throw new AppError(404, "Portfolio item not found");
  return item;
};

export const createItemService = async (data: TCreateItem) => {
  const item = await createItem(data);
  if (!item) throw new AppError(500, "Failed to create portfolio item");
  return item;
};

export const updateItemService = async (id: string, data: TUpdateItem) => {
  const existing = await findItemById(id);
  if (!existing) throw new AppError(404, "Portfolio item not found");
  const item = await updateItem(id, data);
  if (!item) throw new AppError(500, "Failed to update portfolio item");
  return item;
};

export const deleteItemService = async (id: string) => {
  const existing = await findItemById(id);
  if (!existing) throw new AppError(404, "Portfolio item not found");
  return deleteItem(id);
};
