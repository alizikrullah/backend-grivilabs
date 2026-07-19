import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../../config/config.js";

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export const connectPrisma = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};
