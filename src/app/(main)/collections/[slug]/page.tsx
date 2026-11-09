import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { TitleCard, TitleGrid } from "@/features/catalog";
import { getCollection } from "@/features/catalog/server";
import { getLocale } from "@/lib/i18n/get-locale";
import styles from "../page.module.scss";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection((await params).slug, await getLocale());
  return { title: collection?.name };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const locale = await getLocale();
  const collection = await getCollection((await params).slug, locale);
  if (!collection) notFound();

  return (
    <Container className={styles.root}>
      <h1>{collection.name}</h1>
      {collection.description ? (
        <p className={styles.description}>{collection.description}</p>
      ) : null}
      <TitleGrid>
        {collection.titles.map((title) => (
          <li key={title.id}>
            <TitleCard title={title} locale={locale} />
          </li>
        ))}
      </TitleGrid>
    </Container>
  );
}
