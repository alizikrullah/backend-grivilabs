import { AppError } from "../../class/appError.js";
import { createLead, findAllLeads, findLeadById, updateLeadStatus } from "./leads.repository.js";
import type { TCreateLead, TUpdateLeadStatus, TLeadQuery } from "./leads.schemas.js";

const buildMeta = (page: number, limit: number, total: number) => ({
  page, limit, total, totalPages: Math.ceil(total / limit),
});

export const submitLeadService = (data: TCreateLead) => createLead(data);

export const getLeadsService = async (query: TLeadQuery) => {
  const skip = (query.page - 1) * query.limit;
  const [leads, total] = await findAllLeads({ status: query.status, skip, take: query.limit });
  return { data: leads, meta: buildMeta(query.page, query.limit, total) };
};

export const updateLeadStatusService = async (id: string, body: TUpdateLeadStatus) => {
  const lead = await findLeadById(id);
  if (!lead) throw new AppError(404, "Lead not found");
  return updateLeadStatus(id, body.status);
};
