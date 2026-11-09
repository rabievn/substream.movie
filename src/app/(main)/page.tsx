import { Container } from "@/components/ui";
import {
  CollectionGrid,
  HeroFeatured,
  NewOnSiteFeed,
  PeopleCarousel,
  QuickLinks,
  TitleCarousel,
} from "@/features/catalog";
import {
  getCollections,
  getFeaturedTitle,
  getTitles,
  getTopPeople,
  getTopTitles,
  getUpcomingTitles,
} from "@/features/catalog/server";
import { UpcomingSection } from "@/features/upcoming";
import { Section } from "@/components/ui";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

const NEW_FEED_SIZE = 12;

export default async function HomePage() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const [featured, upcoming, topMovies, topSeries, people, newest, collections] = await Promise.all(
    [
      getFeaturedTitle(locale),
      getUpcomingTitles(locale),
      getTopTitles("MOVIE"),
      getTopTitles("SERIES"),
      getTopPeople(),
      getTitles({ sort: "new", page: 1 }, NEW_FEED_SIZE),
      getCollections(locale),
    ],
  );

  return (
    <>
      {featured ? <HeroFeatured title={featured} t={t} locale={locale} /> : null}
      <Container className={styles.sections}>
        <UpcomingSection items={upcoming} t={t} locale={locale} />
        <TitleCarousel
          title={t.homePage.topMovies}
          titles={topMovies}
          seeAllHref="/movies"
          t={t}
          locale={locale}
        />
        <TitleCarousel
          title={t.homePage.topSeries}
          titles={topSeries}
          seeAllHref="/series"
          t={t}
          locale={locale}
        />
        <PeopleCarousel people={people} t={t} />
        <Section title={t.homePage.newOnSite}>
          <NewOnSiteFeed initialItems={newest.items} />
        </Section>
        <Section
          title={t.homePage.collections}
          action={{ href: "/collections", label: t.homePage.seeAll }}
        >
          <CollectionGrid collections={collections} t={t} />
        </Section>
        <QuickLinks t={t} />
      </Container>
    </>
  );
}
