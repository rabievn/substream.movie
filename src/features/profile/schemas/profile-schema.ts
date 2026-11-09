import { z } from "zod";
import { LOCALES } from "@/lib/i18n";

export const PROFILE_NAME_MAX_LENGTH = 60;

export const profileSchema = z.object({
  name: z.string().trim().max(PROFILE_NAME_MAX_LENGTH),
  locale: z.enum(LOCALES),
});

export type ProfileInput = z.infer<typeof profileSchema>;
