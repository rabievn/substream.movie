import { CalendarDays, Play, Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Button, Container, Section } from "@/components/ui";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import type { TitleDetails } from "../server/get-title-details";
import { getDisplayTitle } from "../utils";
import { LevelBadge } from "./level-badge";
import { SeasonList } from "./season-list";
import { TitlePoster } from "./title-poster";
import styles from "./title-details-view.module.scss";

const SECTION_BY_TYPE = { MOVIE: "movies", SERIES: "series", CARTOON: "cartoons" } as const;

interface TitleDetailsViewProps {
  title: TitleDetails;
  t: Dictionary;
  locale: Locale;
  /** Extra actions (add to list, notify me) rendered next to the main button. */
  actions?: ReactNode;
}

export function TitleDetailsView({ title, t, locale, actions }: TitleDetailsViewProps) {
  const displayTitle = getDisplayTitle(title, locale);
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const facts = [
    { label: t.titlePage.year, value: String(title.year) },
    { label: t.titlePage.level, value: <LevelBadge level={title.cefrLevel} /> },
    { label: t.titlePage.language, value: t.catalog.languages[title.language] },
    {
      label: t.titlePage.country,
      value: title.countries.map((code) => regionNames.of(code) ?? code).join(", "),
    },
    title.durationMinutes
      ? {
          label: t.titlePage.duration,
          value: format(t.catalog.minutes, { count: title.durationMinutes }),
        }
      : null,
    title.ageRating ? { label: t.titlePage.age, value: title.ageRating } : null,
    title.directors.length
      ? {
          label: t.titlePage.director,
          value: title.directors.map((person) => (
            <Link key={person.slug} href={`/actors/${person.slug}`} className={styles.inlineLink}>
              {person.name}
            </Link>
          )),
        }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <article className={styles.root}>
      <header className={styles.hero}>
        <div className={styles.backdrop} aria-hidden="true">
          <TitlePoster title="" posterUrl={title.backdropUrl} seed={title.slug} sizes="100vw" />
        </div>
        <Container className={styles.heroInner}>
          <TitlePoster
            title={title.originalTitle}
            posterUrl={title.posterUrl}
            seed={title.slug}
            sizes="(min-width: 768px) 280px, 60vw"
            isPriority
            className={styles.poster}
          />
          <div className={styles.summary}>
            <h1 className={styles.title}>{displayTitle}</h1>
            {displayTitle !== title.originalTitle ? (
              <p className={styles.original} lang="en">
                {title.originalTitle}
              </p>
            ) : null}
            <ul role="list" className={styles.badges}>
              {title.imdbRating ? (
                <li>
                  <Badge variant="accent">
                    <Star aria-hidden="true" size={12} /> IMDb {title.imdbRating.toFixed(1)}
                  </Badge>
                </li>
              ) : null}
              {title.otherRating ? (
                <li>
                  <Badge>
                    <Star aria-hidden="true" size={12} /> {title.otherRating.toFixed(1)}
                  </Badge>
                </li>
              ) : null}
              <li>
                <LevelBadge level={title.cefrLevel} />
              </li>
              {title.genreList.map((genre) => (
                <li key={genre.slug}>
                  <Link
                    href={`/${SECTION_BY_TYPE[title.type]}?genre=${genre.slug}`}
                    className={styles.genre}
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
            {title.tagline ? <p className={styles.tagline}>{title.tagline}</p> : null}
            <div className={styles.actions}>
              {title.isPlayable ? (
                <Button asChild size="lg">
                  <Link href={`/watch/${title.slug}`}>
                    <Play aria-hidden="true" />
                    {t.titlePage.watch}
                  </Link>
                </Button>
              ) : title.releaseDate ? (
                <Badge variant="secondary" className={styles.release}>
                  <CalendarDays aria-hidden="true" size={14} />
                  {format(t.titlePage.trailerSoon, {
                    date: dateFormat.format(new Date(title.releaseDate)),
                  })}
                </Badge>
              ) : null}
              {actions}
            </div>
          </div>
        </Container>
      </header>

      <Container className={styles.body}>
        <div className={styles.columns}>
          <Section title={t.titlePage.about}>
            <p className={styles.description}>{title.description}</p>
          </Section>
          <Section title={t.titlePage.details}>
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>

        {title.seasons.length > 0 ? (
          <Section title={t.titlePage.seasons}>
            <SeasonList titleSlug={title.slug} seasons={title.seasons} />
          </Section>
        ) : null}

        {title.cast.length > 0 ? (
          <Section title={t.titlePage.cast}>
            <ul role="list" className={styles.cast}>
              {title.cast.map((person) => (
                <li key={person.slug}>
                  <Link href={`/actors/${person.slug}`} className={styles.castMember}>
                    <span className={styles.castName}>{person.name}</span>
                    {person.character ? (
                      <span className={styles.castRole}>
                        {format(t.titlePage.as, { character: person.character })}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </Container>
    </article>
  );
}
