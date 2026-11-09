import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CollectionGrid } from "@/features/catalog";
import { getCollections } from "@/features/catalog/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const collections = await getCollections(locale);

  return (
    <Container className={styles.root}>
      <h1>{t.homePage.collections}</h1>
      <CollectionGrid collections={collections} t={t} />
    </Container>
  );
}
