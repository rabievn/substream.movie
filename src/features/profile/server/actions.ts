"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireUser } from "@/features/auth/server";
import { LOCALE_COOKIE } from "@/lib/i18n";
import { db } from "@/lib/db";
import { profileSchema, type ProfileInput } from "../schemas/profile-schema";

export type UpdateProfileResult = { ok: true } | { ok: false; error: "invalid" };

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function updateProfile(input: ProfileInput): Promise<UpdateProfileResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  await db.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name || null, locale: parsed.data.locale },
  });
  (await cookies()).set(LOCALE_COOKIE, parsed.data.locale, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
