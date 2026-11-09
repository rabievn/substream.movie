import { Clock, Info, Play, Star } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Container } from "@/components/ui";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import type { FeaturedTitle } from "../server/home-queries";
import { getDisplayTitle } from "../utils";
import styles from "./hero-featured.module.scss";
import { LevelBadge } from "./level-badge";
import { TitlePoster } from "./title-poster";

interface HeroFeaturedProps {
  title: FeaturedTitle;
  t: Dictionary;
  locale: Locale;
}

export function HeroFeatured({ title, t, locale }: HeroFeaturedProps) {
  const displayTitle = getDisplayTitle(title, locale);

  return (
    <section className={styles.root} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true">
        <TitlePoster
          title=""
          posterUrl={title.backdropUrl}
          seed={title.slug}
          sizes="100vw"
          isPriority
        />
      </div>
      <Container className={styles.inner}>
        <div className={styles.poster}>
          <TitlePoster
            title={title.originalTitle}
            posterUrl={title.posterUrl}
            seed={title.slug}
            sizes="240px"
            isPriority
          />
        </div>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{t.homePage.featured}</p>
          <h1 id="hero-title" className={styles.title}>
            {displayTitle}
          </h1>
          {displayTitle !== title.originalTitle ? (
            <p className={styles.original} lang="en">
              {title.originalTitle}
            </p>
          ) : null}
          <ul role="list" className={styles.meta}>
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
            {title.genreNames.slice(0, 2).map((genre) => (
              <li key={genre}>{genre}</li>
            ))}
            <li>{title.year}</li>
            {title.durationMinutes ? (
              <li className={styles.duration}>
                <Clock aria-hidden="true" size={14} />
                {format(t.catalog.minutes, { count: title.durationMinutes })}
              </li>
            ) : null}
          </ul>
          <p className={styles.description}>{title.description}</p>
          <div className={styles.actions}>
            <Button asChild size="lg">
              <Link href={`/watch/${title.slug}`}>
                <Play aria-hidden="true" />
                {t.homePage.watch}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/title/${title.slug}`}>
                <Info aria-hidden="true" />
                {t.homePage.details}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
