import type { Locale } from "@/lib/i18n";

/** Russian UI shows the localized title when there is one. */
export const getDisplayTitle = (
  title: { originalTitle: string; localizedTitle: string | null },
  locale: Locale,
) => (locale === "ru" && title.localizedTitle ? title.localizedTitle : title.originalTitle);
