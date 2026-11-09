"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  SelectField,
} from "@/components/ui";
import { format } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { SORT_OPTIONS } from "../constants";
import { useCatalogFilters } from "../hooks/use-catalog-filters";
import { titleFilterSchema } from "../schemas/title-filter-schema";
import type { FilterOptions } from "../types";
import { CatalogFilters } from "./catalog-filters";
import styles from "./catalog-toolbar.module.scss";

const SORT_LABEL_KEY = {
  popular: "sortPopular",
  new: "sortNew",
  imdb: "sortImdb",
  rating: "sortRating",
} as const;

interface CatalogToolbarProps {
  total: number;
  options: FilterOptions;
}

export function CatalogToolbar({ total, options }: CatalogToolbarProps) {
  const { t } = useI18n();
  const { filter, setFilter, activeCount, isPending } = useCatalogFilters();

  return (
    <div className={styles.root} aria-busy={isPending}>
      <p className={styles.count} role="status">
        {format(t.catalog.results, { count: total })}
      </p>
      <div className={styles.controls}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filtersButton}>
              <SlidersHorizontal aria-hidden="true" />
              {t.catalog.filters}
              {activeCount > 0 ? <span className={styles.counter}>{activeCount}</span> : null}
            </Button>
          </DialogTrigger>
          <DialogContent title={t.catalog.filters} closeLabel={t.nav.closeMenu} placement="end">
            <CatalogFilters options={options} />
            <DialogClose asChild>
              <Button isFullWidth>{t.catalog.applyFilters}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <SelectField
          label={t.catalog.sort}
          className={styles.sort}
          value={filter.sort}
          options={SORT_OPTIONS.map((sort) => ({
            value: sort,
            label: t.catalog[SORT_LABEL_KEY[sort]],
          }))}
          onChange={(event) =>
            setFilter({ sort: titleFilterSchema.shape.sort.parse(event.target.value) })
          }
        />
      </div>
    </div>
  );
}
