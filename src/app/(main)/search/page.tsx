import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, Section, TextField } from "@/components/ui";
import { TitleCard, TitleGrid } from "@/features/catalog";
import { searchCatalog } from "@/features/catalog/server";
import { format } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export const metadata: Metadata = { title: "Search" };

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const rawQuery = (Array.isArray(q) ? q[0] : q) ?? "";
  const [t, locale, results] = await Promise.all([
    getDictionary(),
    getLocale(),
    searchCatalog(rawQuery),
  ]);
  const hasQuery = results.query.length > 0;
  const isEmpty = hasQuery && results.titles.length === 0 && results.people.length === 0;

  return (
    <Container className={styles.root}>
      <h1>{t.search.title}</h1>
      {/* Plain GET form: works without JavaScript and keeps the query in the URL. */}
      <form role="search" action="/search" className={styles.form}>
        <TextField
          label={t.search.label}
          name="q"
          type="search"
          defaultValue={rawQuery}
          placeholder={t.search.placeholder}
          autoFocus={!hasQuery}
          minLength={2}
        />
        <Button type="submit" size="lg">
          {t.search.submit}
        </Button>
      </form>

      {hasQuery && results.query.length < 2 ? (
        <p className={styles.muted}>{t.search.hint}</p>
      ) : null}
      {isEmpty && results.query.length >= 2 ? (
        <p className={styles.muted} role="status">
          {format(t.search.noResults, { query: results.query })}
        </p>
      ) : null}

      {results.titles.length > 0 ? (
        <Section title={t.search.titles}>
          <TitleGrid>
            {results.titles.map((title) => (
              <li key={title.id}>
                <TitleCard title={title} locale={locale} />
              </li>
            ))}
          </TitleGrid>
        </Section>
      ) : null}

      {results.people.length > 0 ? (
        <Section title={t.search.people}>
          <ul role="list" className={styles.people}>
            {results.people.map((person) => (
              <li key={person.id}>
                <Link href={`/actors/${person.slug}`} className={styles.person}>
                  {person.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </Container>
  );
}
