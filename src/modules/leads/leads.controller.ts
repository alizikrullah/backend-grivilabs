import type { Request, Response, NextFunction } from "express";
import { submitLeadService, getLeadsService, updateLeadStatusService } from "./leads.service.js";
import type { TCreateLead, TUpdateLeadStatus, TLeadIdParams, TLeadQuery } from "./leads.schemas.js";

export const submitLeadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await submitLeadService(req.validated?.body as TCreateLead);
    return res.status(201).json({ message: "Pesan berhasil dikirim, kami akan segera menghubungi Anda.", data });
  } catch (error) { next(error); }
};

export const getLeadsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getLeadsService(req.validated?.query as TLeadQuery);
    return res.status(200).json({ message: "OK", ...result });
  } catch (error) { next(error); }
};

export const updateLeadStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateLeadStatusService(
      (req.validated?.params as TLeadIdParams).id,
      req.validated?.body as TUpdateLeadStatus
    );
    return res.status(200).json({ message: "Lead status updated", data });
  } catch (error) { next(error); }
};
