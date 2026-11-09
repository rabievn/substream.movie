import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { serverEnv } from "@/config/server-env";
import { PrismaClient } from "@/generated/prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: serverEnv.DATABASE_URL }),
    log: serverEnv.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (serverEnv.NODE_ENV !== "production") globalForPrisma.prisma = db;
