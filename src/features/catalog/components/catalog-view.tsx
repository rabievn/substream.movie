import { Container } from "@/components/ui";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { TitleFilter } from "../schemas/title-filter-schema";
import type { FilterOptions, TitlePage } from "../types";
import { CatalogFilters } from "./catalog-filters";
import { CatalogResults } from "./catalog-results";
import { CatalogToolbar } from "./catalog-toolbar";
import styles from "./catalog-view.module.scss";

interface CatalogViewProps {
  heading: string;
  filter: TitleFilter;
  firstPage: TitlePage;
  options: FilterOptions;
  t: Dictionary;
  locale: Locale;
}

/** Page shell shared by /movies, /series and /cartoons. */
export function CatalogView({ heading, filter, firstPage, options, t }: CatalogViewProps) {
  // `page` in the URL isn't used for rendering: the grid always starts at page 1.
  const { page: _page, ...query } = filter;
  const queryKey = JSON.stringify(query);

  return (
    <Container className={styles.root}>
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label={t.catalog.filters}>
          <CatalogFilters options={options} />
        </aside>
        <div className={styles.main}>
          <CatalogToolbar total={firstPage.total} options={options} />
          <CatalogResults key={queryKey} firstPage={firstPage} query={query} />
        </div>
      </div>
    </Container>
  );
}
