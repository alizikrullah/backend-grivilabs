export interface IValidatedRequest {
  query?: unknown;
  body?: unknown;
  params?: unknown;
}

declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; email: string; name: string };
      validated?: IValidatedRequest;
    }
  }
}