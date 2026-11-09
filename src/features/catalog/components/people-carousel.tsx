import Link from "next/link";
import { Carousel, Section } from "@/components/ui";
import type { Dictionary } from "@/lib/i18n";
import styles from "./people-carousel.module.scss";

interface PeopleCarouselProps {
  people: { id: string; slug: string; name: string; photoUrl: string | null }[];
  t: Dictionary;
}

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export function PeopleCarousel({ people, t }: PeopleCarouselProps) {
  if (people.length === 0) return null;

  return (
    <Section title={t.homePage.topActors} hasCarousel>
      <Carousel
        label={t.homePage.topActors}
        previousLabel={t.homePage.previous}
        nextLabel={t.homePage.next}
        itemSize="avatar"
      >
        {people.map((person) => (
          <li key={person.id}>
            <Link href={`/actors/${person.slug}`} className={styles.person}>
              <span className={styles.avatar} aria-hidden="true">
                {getInitials(person.name)}
              </span>
              <span className={styles.name}>{person.name}</span>
            </Link>
          </li>
        ))}
      </Carousel>
    </Section>
  );
}
