import type { Metadata } from "next";
import { DictionaryView } from "@/features/dictionary";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "../profile/page.module.scss";

export const metadata: Metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const t = await getDictionary();

  return (
    <div className={styles.settings}>
      <h1 className={styles.name}>{t.dictionary.title}</h1>
      <DictionaryView />
    </div>
  );
}
