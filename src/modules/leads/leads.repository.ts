import { prisma } from "../../libs/prisma/prisma.lib.js";
import type { TCreateLead } from "./leads.schemas.js";

export const createLead = (data: TCreateLead) =>
  prisma.lead.create({ data });

export const findAllLeads = (params: { status?: string; skip: number; take: number }) => {
  const where = params.status ? { status: params.status } : {};
  return Promise.all([
    prisma.lead.findMany({ where, orderBy: { created_at: "desc" }, skip: params.skip, take: params.take }),
    prisma.lead.count({ where }),
  ]);
};

export const findLeadById = (id: string) =>
  prisma.lead.findUnique({ where: { id } });

export const updateLeadStatus = (id: string, status: string) =>
  prisma.lead.update({ where: { id }, data: { status } });
