"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { THEME_STORAGE_KEY } from "./theme-script";

type Theme = "light" | "dark";

const getCurrentTheme = (): Theme => {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeToggle() {
  const { t } = useI18n();

  const handleThemeToggle = () => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  };

  return (
    <IconButton aria-label={t.theme.toggle} onClick={handleThemeToggle}>
      {/* Both icons render; CSS shows the one matching the active theme (no hydration mismatch). */}
      <Sun aria-hidden="true" data-theme-icon="light" />
      <Moon aria-hidden="true" data-theme-icon="dark" />
    </IconButton>
  );
}
