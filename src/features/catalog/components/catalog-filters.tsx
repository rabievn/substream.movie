"use client";

import clsx from "clsx";
import { SelectField } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { CEFR_LEVELS, LANGUAGES } from "../constants";
import { titleFilterSchema } from "../schemas/title-filter-schema";
import { useCatalogFilters } from "../hooks/use-catalog-filters";
import type { CefrLevel, FilterOptions } from "../types";
import styles from "./catalog-filters.module.scss";

const ANY = "";

export function CatalogFilters({ options }: { options: FilterOptions }) {
  const { t } = useI18n();
  const { filter, setFilter, resetFilters, activeCount } = useCatalogFilters();
  const years = Array.from(
    { length: options.years.max - options.years.min + 1 },
    (_, index) => options.years.max - index,
  );
  const yearOptions = [
    { value: ANY, label: t.catalog.any },
    ...years.map((year) => ({ value: String(year), label: String(year) })),
  ];

  const handleLevelToggle = (level: CefrLevel) => {
    const current = filter.level ?? [];
    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level];
    setFilter({ level: next });
  };

  return (
    <div className={styles.root}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{t.catalog.level}</legend>
        <div className={styles.chips}>
          {CEFR_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={clsx(styles.chip, filter.level?.includes(level) && styles.isSelected)}
              aria-pressed={filter.level?.includes(level) ?? false}
              onClick={() => handleLevelToggle(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </fieldset>

      <SelectField
        label={t.catalog.language}
        value={filter.lang ?? ANY}
        options={[
          { value: ANY, label: t.catalog.any },
          ...LANGUAGES.map((lang) => ({ value: lang, label: t.catalog.languages[lang] })),
        ]}
        onChange={(event) =>
          setFilter({ lang: titleFilterSchema.shape.lang.parse(event.target.value) })
        }
      />

      <SelectField
        label={t.catalog.genre}
        value={filter.genre ?? ANY}
        options={[
          { value: ANY, label: t.catalog.any },
          ...options.genres.map((genre) => ({ value: genre.slug, label: genre.name })),
        ]}
        onChange={(event) => setFilter({ genre: event.target.value || undefined })}
      />

      <div className={styles.row}>
        <SelectField
          label={t.catalog.yearFrom}
          value={filter.from ? String(filter.from) : ANY}
          options={yearOptions}
          onChange={(event) => setFilter({ from: Number(event.target.value) || undefined })}
        />
        <SelectField
          label={t.catalog.yearTo}
          value={filter.to ? String(filter.to) : ANY}
          options={yearOptions}
          onChange={(event) => setFilter({ to: Number(event.target.value) || undefined })}
        />
      </div>

      <SelectField
        label={t.catalog.country}
        value={filter.country ?? ANY}
        options={[
          { value: ANY, label: t.catalog.any },
          ...options.countries.map((country) => ({ value: country, label: country })),
        ]}
        onChange={(event) => setFilter({ country: event.target.value || undefined })}
      />

      {activeCount > 0 ? (
        <button type="button" className={styles.reset} onClick={resetFilters}>
          {t.catalog.reset}
        </button>
      ) : null}
    </div>
  );
}
