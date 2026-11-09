import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "../page.module.scss";

export const metadata: Metadata = { title: "Check your email" };

export default async function CheckEmailPage() {
  const t = await getDictionary();

  return (
    <Container className={styles.root}>
      <div className={styles.card}>
        <MailCheck aria-hidden="true" size={40} />
        <h1 className={styles.title}>{t.auth.checkEmailTitle}</h1>
        <p className={styles.subtitle}>{t.auth.checkEmailText}</p>
      </div>
    </Container>
  );
}
