import { Carousel, Section } from "@/components/ui";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { TitleCardData } from "../types";
import { TitleCard } from "./title-card";

interface TitleCarouselProps {
  title: string;
  titles: TitleCardData[];
  seeAllHref?: string;
  t: Dictionary;
  locale: Locale;
}

export function TitleCarousel({ title, titles, seeAllHref, t, locale }: TitleCarouselProps) {
  if (titles.length === 0) return null;

  return (
    <Section
      title={title}
      hasCarousel
      action={seeAllHref ? { href: seeAllHref, label: t.homePage.seeAll } : undefined}
    >
      <Carousel label={title} previousLabel={t.homePage.previous} nextLabel={t.homePage.next}>
        {titles.map((item) => (
          <li key={item.id}>
            <TitleCard title={item} locale={locale} />
          </li>
        ))}
      </Carousel>
    </Section>
  );
}
