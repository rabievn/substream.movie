"use client";

import { useTransition } from "react";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { setLocale } from "@/lib/i18n/set-locale";
import styles from "./locale-switch.module.scss";

export function LocaleSwitch() {
  const { locale, t } = useI18n();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: Locale) => {
    startTransition(() => setLocale(nextLocale));
  };

  return (
    <div className={styles.root} role="group" aria-label={t.locale.label} aria-busy={isPending}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          className={styles.option}
          aria-pressed={option === locale}
          lang={option}
          title={t.locale[option]}
          onClick={() => handleLocaleChange(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
