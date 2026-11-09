import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export const metadata: Metadata = { title: "Help & FAQ" };

export default async function HelpPage() {
  const t = await getDictionary();

  return (
    <Container className={styles.root}>
      <h1>{t.help.title}</h1>
      <div className={styles.faq}>
        {t.help.faq.map((item) => (
          <details key={item.q} className={styles.item}>
            <summary className={styles.question}>{item.q}</summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
      <p className={styles.contact}>
        <a href="mailto:support@substream.movie">{t.help.contact}</a>
      </p>
    </Container>
  );
}
