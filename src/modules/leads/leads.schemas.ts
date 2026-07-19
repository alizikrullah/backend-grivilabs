import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.enum(["the-hook", "digital-storefront", "the-engine", "other"]).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export const leadIdParamsSchema = z.object({
  id: z.string().uuid("Invalid lead ID"),
});

export const leadQuerySchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(20),
});

export type TCreateLead = z.infer<typeof createLeadSchema>;
export type TUpdateLeadStatus = z.infer<typeof updateLeadStatusSchema>;
export type TLeadIdParams = z.infer<typeof leadIdParamsSchema>;
export type TLeadQuery = z.infer<typeof leadQuerySchema>;
