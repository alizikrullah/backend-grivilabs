import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type TLoginBody = z.infer<typeof loginBodySchema>;