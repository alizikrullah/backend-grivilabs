import { AppError } from "../../class/appError.js";
import {
  findPublishedServices, findServiceBySlug,
  findAllServicesAdmin, findServiceById, findServiceBySlugAny,
  createService, updateService, deleteService,
} from "./services.repository.js";
import { derivePrice } from "./services.pricing.js";
import type { TCreateService, TUpdateService } from "./services.schemas.js";

type ServiceRow = Awaited<ReturnType<typeof findServiceById>>;

// Harga kartu homepage ditempelkan di sini, bukan disimpan di database.
const withPrice = <T extends NonNullable<ServiceRow>>(service: T) => ({
  ...service,
  ...derivePrice(service.tiers, service.home_price_override),
});

export const getPublishedServicesService = async () => {
  const services = await findPublishedServices();
  return { data: services.map(withPrice) };
};

export const getServiceBySlugService = async (slug: string) => {
  const service = await findServiceBySlug(slug);
  if (!service) throw new AppError(404, "Service not found");
  return withPrice(service);
};

export const getAllServicesAdminService = async () => {
  const services = await findAllServicesAdmin();
  return { data: services.map(withPrice) };
};

export const getServiceByIdService = async (id: string) => {
  const service = await findServiceById(id);
  if (!service) throw new AppError(404, "Service not found");
  return withPrice(service);
};

export const createServiceService = async (data: TCreateService) => {
  const taken = await findServiceBySlugAny(data.slug);
  if (taken) throw new AppError(409, `Slug "${data.slug}" is already used`);
  const created = await createService(data);
  return withPrice(created);
};

export const updateServiceService = async (id: string, data: TUpdateService) => {
  const service = await findServiceById(id);
  if (!service) throw new AppError(404, "Service not found");

  if (data.slug && data.slug !== service.slug) {
    const taken = await findServiceBySlugAny(data.slug);
    if (taken) throw new AppError(409, `Slug "${data.slug}" is already used`);
  }

  const updated = await updateService(id, data);
  return withPrice(updated);
};

export const deleteServiceService = async (id: string) => {
  const service = await findServiceById(id);
  if (!service) throw new AppError(404, "Service not found");
  return deleteService(id);
};
