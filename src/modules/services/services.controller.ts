import type { Request, Response, NextFunction } from "express";
import {
  getPublishedServicesService, getServiceBySlugService,
  getAllServicesAdminService, getServiceByIdService,
  createServiceService, updateServiceService, deleteServiceService,
} from "./services.service.js";
import type {
  TCreateService, TUpdateService, TServiceIdParams, TServiceSlugParams,
} from "./services.schemas.js";

export const getPublishedServicesController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPublishedServicesService();
    return res.status(200).json({ message: "OK", ...result });
  } catch (error) { next(error); }
};

export const getServiceBySlugController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getServiceBySlugService((req.validated?.params as TServiceSlugParams).slug);
    return res.status(200).json({ message: "OK", data });
  } catch (error) { next(error); }
};

export const getAllServicesAdminController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllServicesAdminService();
    return res.status(200).json({ message: "OK", ...result });
  } catch (error) { next(error); }
};

export const getServiceByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getServiceByIdService((req.validated?.params as TServiceIdParams).id);
    return res.status(200).json({ message: "OK", data });
  } catch (error) { next(error); }
};

export const createServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await createServiceService(req.validated?.body as TCreateService);
    return res.status(201).json({ message: "Service created", data });
  } catch (error) { next(error); }
};

export const updateServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateServiceService(
      (req.validated?.params as TServiceIdParams).id,
      req.validated?.body as TUpdateService
    );
    return res.status(200).json({ message: "Service updated", data });
  } catch (error) { next(error); }
};

export const deleteServiceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteServiceService((req.validated?.params as TServiceIdParams).id);
    return res.status(200).json({ message: "Service deleted" });
  } catch (error) { next(error); }
};
