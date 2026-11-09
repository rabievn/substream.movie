import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui";
import { TitleCard, TitleGrid } from "@/features/catalog";
import { getPersonWithTitles } from "@/features/catalog/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

interface ActorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ActorPageProps): Promise<Metadata> {
  const person = await getPersonWithTitles((await params).slug);
  return { title: person?.name };
}

export default async function ActorPage({ params }: ActorPageProps) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const person = await getPersonWithTitles((await params).slug);
  if (!person) notFound();

  // A person can be both actor and director on one title — show the title once.
  const titles = [
    ...new Map(person.credits.map((credit) => [credit.title.id, credit.title])).values(),
  ];

  return (
    <Container className={styles.root}>
      <h1>{person.name}</h1>
      {person.bio ? <p className={styles.bio}>{person.bio}</p> : null}
      <Section title={t.titlePage.filmography}>
        <TitleGrid>
          {titles.map((title) => (
            <li key={title.id}>
              <TitleCard title={title} locale={locale} />
            </li>
          ))}
        </TitleGrid>
      </Section>
    </Container>
  );
}
