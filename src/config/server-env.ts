import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
});

/** Server-only environment, validated on first import. */
export const serverEnv = serverEnvSchema.parse(process.env);
