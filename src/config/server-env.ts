import "server-only";
import { z } from "zod";

/** Treats empty strings (e.g. `EMAIL_SERVER=` in .env) as unset. */
const optionalString = z
  .string()
  .optional()
  .transform((value) => value || undefined);

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  /** SMTP connection string for magic-link emails. Unset in dev ⇒ links are logged. */
  EMAIL_SERVER: optionalString,
  EMAIL_FROM: z.string().default("substream.movie <no-reply@substream.movie>"),
  /** Print magic links to the server log instead of failing when EMAIL_SERVER is unset. */
  AUTH_LOG_MAGIC_LINKS: z.stringbool().default(false),
  AUTH_GOOGLE_ID: optionalString,
  AUTH_GOOGLE_SECRET: optionalString,
});

/** Server-only environment, validated on first import. */
export const serverEnv = serverEnvSchema.parse(process.env);

export const isGoogleAuthEnabled = Boolean(
  serverEnv.AUTH_GOOGLE_ID && serverEnv.AUTH_GOOGLE_SECRET,
);
