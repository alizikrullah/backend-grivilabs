import type { Request, Response, NextFunction } from "express";
import {
  getActiveCategoriesService, getAllCategoriesAdminService,
  createCategoryService, updateCategoryService, deleteCategoryService,
  getActiveFlagsService, getAllFlagsAdminService,
  createFlagService, updateFlagService, deleteFlagService,
  getPublishedItemsService, getPublishedItemBySlugService,
  getAllItemsAdminService, createItemService, updateItemService, deleteItemService,
} from "./portfolio.service.js";
import type {
  TCreateCategory, TUpdateCategory,
  TCreateFlag, TUpdateFlag,
  TCreateItem, TUpdateItem,
  TIdParams, TItemSlugParams,
  TItemQuery, TAdminItemQuery,
} from "./portfolio.schemas.js";

// ─── Categories ──
export const getActiveCategoriesController = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", data: await getActiveCategoriesService() }); }
  catch (error) { next(error); }
};
export const getAllCategoriesAdminController = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", data: await getAllCategoriesAdminService() }); }
  catch (error) { next(error); }
};
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(201).json({ message: "Category created", data: await createCategoryService(req.validated?.body as TCreateCategory) }); }
  catch (error) { next(error); }
};
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateCategoryService((req.validated?.params as TIdParams).id, req.validated?.body as TUpdateCategory);
    return res.status(200).json({ message: "Category updated", data });
  } catch (error) { next(error); }
};
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try { await deleteCategoryService((req.validated?.params as TIdParams).id); return res.status(200).json({ message: "Category deleted" }); }
  catch (error) { next(error); }
};

// ─── Flags ──
export const getActiveFlagsController = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", data: await getActiveFlagsService() }); }
  catch (error) { next(error); }
};
export const getAllFlagsAdminController = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", data: await getAllFlagsAdminService() }); }
  catch (error) { next(error); }
};
export const createFlagController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(201).json({ message: "Flag created", data: await createFlagService(req.validated?.body as TCreateFlag) }); }
  catch (error) { next(error); }
};
export const updateFlagController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateFlagService((req.validated?.params as TIdParams).id, req.validated?.body as TUpdateFlag);
    return res.status(200).json({ message: "Flag updated", data });
  } catch (error) { next(error); }
};
export const deleteFlagController = async (req: Request, res: Response, next: NextFunction) => {
  try { await deleteFlagService((req.validated?.params as TIdParams).id); return res.status(200).json({ message: "Flag deleted" }); }
  catch (error) { next(error); }
};

// ─── Items ──
export const getPublishedItemsController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", ...await getPublishedItemsService(req.validated?.query as TItemQuery) }); }
  catch (error) { next(error); }
};
export const getPublishedItemBySlugController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", data: await getPublishedItemBySlugService((req.validated?.params as TItemSlugParams).slug) }); }
  catch (error) { next(error); }
};
export const getAllItemsAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ message: "OK", ...await getAllItemsAdminService(req.validated?.query as TAdminItemQuery) }); }
  catch (error) { next(error); }
};
export const createItemController = async (req: Request, res: Response, next: NextFunction) => {
  try { return res.status(201).json({ message: "Portfolio item created", data: await createItemService(req.validated?.body as TCreateItem) }); }
  catch (error) { next(error); }
};
export const updateItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateItemService((req.validated?.params as TIdParams).id, req.validated?.body as TUpdateItem);
    return res.status(200).json({ message: "Portfolio item updated", data });
  } catch (error) { next(error); }
};
export const deleteItemController = async (req: Request, res: Response, next: NextFunction) => {
  try { await deleteItemService((req.validated?.params as TIdParams).id); return res.status(200).json({ message: "Portfolio item deleted" }); }
  catch (error) { next(error); }
};
