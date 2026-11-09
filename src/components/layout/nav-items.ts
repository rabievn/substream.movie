import type { Dictionary } from "@/lib/i18n";

export interface NavItem {
  href: string;
  labelKey: keyof Dictionary["nav"];
}

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { href: "/movies", labelKey: "movies" },
  { href: "/series", labelKey: "series" },
  { href: "/cartoons", labelKey: "cartoons" },
  { href: "/collections", labelKey: "collections" },
];
