"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale } from "./dictionaries";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Server action: persists the UI language. Setting a cookie re-renders the current route. */
export async function setLocale(locale: string) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
}
